const { Pool, Client } = require('pg')
const axios = require('axios')
const { sendInvoiceInternal } = require('../invoicePdf/sendInvoiceInternal');

const pool = new Pool({
	user: 'postgres',
	host: 'is-pos.cpuskbampv3u.us-east-2.rds.amazonaws.com',
	database: 'pos',
	password: 'manchasymima',
	port: 5432,
})

const getInvoiceProducts = async (request, response) => {
	try {
		const invoice = parseInt(request.params.invoice);
		const invoiceProducts = await pool.query(`
		SELECT * FROM sales_products
		WHERE id_sale =$1`, [invoice]);

		const customerId = await pool.query(`
		SELECT customer_id FROM sales
		WHERE id_sale =$1`, [invoice]);

		if (customerId.rows.length <= 0) {
			response.status(200).json({ "status": "la factura no existe" });
			throw "La factura no existe";
		}
		const customerInfo = await axios.get('https://ids-crm.herokuapp.com/api/costumer/read_single.php?nit=' + customerId.rows[0].customer_id);



		response.status(200).json({
			client: customerInfo.data,
			products: invoiceProducts.rows
		})

	} catch (error) {
		console.error(error);
	}
}

const postReturn = async (request, response) => {
	try {
		const { sku, amount, invoice, id_bodega } = request.body
		//console.log("Bodega - " + id_bodega);
		if (amount <= 0) {
			throw "No se pueden devolver una cantidad negativa";
		}
		var oldAmount = await pool.query(`
		SELECT quantity FROM sales_products
		WHERE sku = $1 AND id_sale = $2`, [sku, parseInt(invoice)]);
		
		let resultbodegas = await pool.query(`select *
        from bodegas
            where id_bodega = $1`,[id_bodega]);
		let bodegas = resultbodegas.rows[0];

		if (oldAmount.rows.length <= 0) {
			response.status(200).json({ "status": "la factura no existe" });
			return;
		}

		var newAmount = parseInt(oldAmount.rows[0].quantity) - parseInt(amount);

		if (newAmount < 0) {
			throw "La factura no contiene la cantidad de productos devueltos";
		}
		//create return registry
		var id = await pool.query(`
		INSERT INTO sales_returns
		(id_bodega,id_sale,sku,quantity,created_at,created_by)
		values($1,$2,$3,$4,Now() at time zone 'America/Guatemala',$5) RETURNING id_return`, [id_bodega, invoice, sku, amount, "POS"]);

		//get all sales info
		var invoiceProducts = await pool.query(`
		SELECT * FROM sales_products
		WHERE id_sale =$1`, [invoice]);

		//customer id
		const customerId = await pool.query(`
		SELECT customer_id FROM sales
		WHERE id_sale =$1`, [invoice]);

		//delete sale
		
		var a = await pool.query(`
		DELETE FROM sales_products WHERE id_sale = $1`, [invoice]);
		var b = await pool.query(`
		DELETE FROM sales WHERE id_sale = $1`, [invoice]);
		
		//console.log(bodegas);

		await axios({
			method: 'post',
			url: bodegas.base_url + 'bodega/' + bodegas.id_bodega + '/purhcase',
			data: {
				sku: sku,
				quantity: parseInt(amount) 
			}
		});	

		const nit = customerId.rows[0].customer_id;

		//loop to calculete totals
		var total_sale = 0;
		var total_discount = 0;

		for (var i = 0; i < invoiceProducts.rows.length; i++) {
			if (invoiceProducts.rows[i].sku == sku) {
				invoiceProducts.rows[i].quantity = newAmount;
			}
			total_sale += invoiceProducts.rows[i].quantity * invoiceProducts.rows[i].unit_price*(1-(invoiceProducts.rows[i].discount_percentage/100));
			total_discount += total_sale * invoiceProducts.rows[i].discount_percentage/100;
		}

		//filter if quantity == 0
		invoiceProducts.rows = invoiceProducts.rows.filter(p => p.quantity > 0);

		if(invoiceProducts.rows.length==0){
			response.status(200).json({"status":"la factura nueva no contine productos"});
			return;
		}

		//create new invoice
		const invoice_id = await pool.query(`
		INSERT INTO sales (id_bodega,massive_sale_id, customer_id, total_sale, total_discount, created_at, created_by)
		values($6,$1,$2,$3,$4,Now() at time zone 'America/Guatemala',$5) RETURNING id_sale`, [Math.floor(Math.random() * 100000)
			, nit, total_sale, total_discount,"POS",id_bodega]);

		//create the products registers
		for (var i = 0; i < invoiceProducts.rows.length; i++) {
			let quantity = invoiceProducts.rows[i].quantity;
			let price = invoiceProducts.rows[i].unit_price;
			let discount = invoiceProducts.rows[i].discount_percentage;
			let totalDisc = quantity * price * discount / 100;
			await pool.query(`
			INSERT INTO sales_products (id_sale, id_bodega, sku, quantity, unit_price, discount_percentage, total_product, total_discount,
				total, created_at, created_by)
			values($1,$2,$3,$4,$5,$6,$7,$8,$9,Now() at time zone 'America/Guatemala',$10)`, [invoice_id.rows[0].id_sale, id_bodega,
				invoiceProducts.rows[i].sku, quantity, price,
				discount, quantity * price, totalDisc,quantity * price-totalDisc, "POS"]);
		}
		//change discount percentage
		/*
		const test = await pool.query(`
		UPDATE sales_products 
		SET total_discount = unit_price*discount_percentage/100.0*quantity`);
		*/
		send_internal_sales_invoice(invoice_id.rows[0].id_sale);
		response.status(200).json(invoice_id.rows);

	} catch (error) {
		console.error(error);
	}
}

const deleteReturnedInvoice = async (request, response) => {
	try {
		const invoice = parseInt(request.params.invoice);
		var a = await pool.query(`
		DELETE FROM sales_products WHERE id_sale = $1`, [invoice]);
		var b = await pool.query(`
		DELETE FROM sales WHERE id_sale = $1`, [invoice]);
		response.status(200).json({ "action": "se ha borrado exitosamente la factura" })

	} catch (error) {
		console.error(error);
	}
}

function send_internal_sales_invoice(id){
    pool.query(`
      select massive_sale_id, id_sale, customer_id, invoice_id,
          total_sale, total_discount
              from sales
              where id_sale = $1`, [id],
        (error, results) => {
            if (error) {
                console.log('error', error)
                throw error
            }
            let body = results.rows
            pool.query(`
          select sku product_code, quantity, unit_price, discount_percentage,
              total_product, total_discount, total
              from sales_products
                  where id_sale = $1 ;`, [id],
                (error2, results2) => {
                    if (error2) {
                        console.log('error', error2)
                        throw error2
                    }
                    body[0].products = results2.rows
                    axios({
                        method: 'get',
                        url: 'https://ids-crm.herokuapp.com/api/costumer/read_single.php?nit=' + body[0].customer_id,
                    }).then(res => {
                        let info = res.data;
                        if (info.nit != null) {
                            body[0].nombres = info.cname;
                            body[0].direccion = info.caddress;
                            body[0].email = info.cemail;
                            sendInvoiceInternal(body[0]);
                        }
                    })
                })
        })
}

module.exports = {
	postReturn,
	getInvoiceProducts,
	deleteReturnedInvoice,
}