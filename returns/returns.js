const { Pool, Client } = require('pg')
const axios = require('axios')

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
		var invoiceProducts = await pool.query(`
		SELECT * FROM sales_products
		WHERE id_sale =$1`, [invoice]);
		response.status(200).json(invoiceProducts.rows)
	} catch (error) {
		console.error(error);
	}
}

const postReturn = async (request, response) => {
	try {
		const {sku, amount, invoice} = request.body

		var oldAmount = await pool.query(`
		SELECT quantity FROM sales_products
		WHERE sku = $1 AND id_sale = $2`, [sku,invoice]);

		var newAmount = parseInt(oldAmount.rows[0].quantity)-amount;

		if(newAmount<0){
			throw "La factura no contiene la cantidad de productos devuentos";
		}
		
		//update amount of product
		await pool.query(`
		UPDATE sales_products
		SET quantity = $3
		WHERE sku = $1 AND id_sale = $2`, [sku,invoice,newAmount]);

		var newDataProduct =await pool.query(`
		SELECT * FROM sales_products
		WHERE id_sale = $1`, [invoice]);

		response.status(200).json(
			newDataProduct.rows)

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
		response.status(200).json({"action":"se ha borrado exitosamente la factura"})

	} catch (error) {
		console.error(error);
	}
}

module.exports = {
	postReturn,
	getInvoiceProducts,
	deleteReturnedInvoice,
}