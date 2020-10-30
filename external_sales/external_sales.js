const { Pool } = require('pg')
const { createInvoice } = require("../invoicePdf/createInvoice");
const { createInvoiceInternal } = require("../invoicePdf/createInvoiceInternal.js");
const axios = require('axios');
const { sendInvoiceInternal } = require('../invoicePdf/sendInvoiceInternal');
const { sendInvoice } = require('../invoicePdf/sendInvoice')

const pool = new Pool({
    user: 'postgres',
    host: 'is-pos.cpuskbampv3u.us-east-2.rds.amazonaws.com',
    database: 'pos',
    password: 'manchasymima',
    port: 5432,
})

const create_external_sales = (request, response) => {

    const { products } = request.body
    const id_bodega = 7

    if (request.body.external_sale_id == undefined) {
        const {
            massive_sale_id,
            customer_id, total_sale,
            total_discount
        } = request.body
        const created_by = 'POS'
        pool.query(`insert into sales
      (id_bodega, massive_sale_id, customer_id, total_sale, total_discount,
        created_at, created_by) values($1,$2,$3,$4,$5,now() at time zone 'America/Guatemala',$6) RETURNING id_sale`,
            [
                id_bodega, massive_sale_id, customer_id, total_sale, total_discount,
                created_by
            ],

            (error, sales_result) => {
                if (error) {
                    response.status(500).send('Something went wrong were sorry')
                } else {
                    if (sales_result.rows.length > 0) {
                        products.map((item) => {
                            axios({
                                method: 'post',
                                url: 'https://inventarios-is.herokuapp.com/bodega/7/out',
                                data: {
                                    sku: item.product_code,
                                    quantity: item.quantity
                                }
                            }).then((externalApiResponse) => {
                                if (externalApiResponse.status === 200) {
                                    pool.query(
                                        `insert into sales_products
                  (
                    id_sale, id_bodega, sku, quantity, unit_price,
                    discount_percentage, total_product, 
                    total_discount, total, created_at, created_by
                  )
                  values($1,$2,$3,$4,$5,$6,$7,$8,$9,now() at time zone 'America/Guatemala',$10)`,
                                        [sales_result.rows[0].id_sale, id_bodega, item.product_code, item.quantity,
                                        item.unit_price, item.discount_percentage, item.total_product,
                                        item.total_discount, item.total, created_by
                                        ],
                                        (error, sales_products_reslt) => {
                                            if (error) {
                                                response.status(500).send('Algo exploto')
                                            }
                                        })
                                    send_internal_sales_invoice(sales_result.rows[0].id_sale);
                                    response.send({ id: sales_result.rows[0].id_sale })
                                }
                            })
                        })
                    }
                }
            })
    } else {
        const {
            massive_sale_id,
            customer_id, total_sale,
            total_discount,
            external_sale_id,
            invoice_id
        } = request.body
        const created_by = 'SALES'
        pool.query(`insert into sales
        (id_bodega, massive_sale_id, customer_id, total_sale, total_discount,
        created_at, created_by, external_sale_id, invoice_id) 
        values($1,$2,$3,$4,$5,now() at time zone 'America/Guatemala',$6,$7,$8) RETURNING id_sale`,
            [
                id_bodega, massive_sale_id, customer_id, total_sale, total_discount,
                created_by, external_sale_id, invoice_id
            ],

            (error, sales_result) => {
                if (error) {
                    response.status(500).send('Something went wrong were sorry')
                } else {
                    if (sales_result.rows.length > 0) {
                        products.map((item) => {
                            axios({
                                method: 'post',
                                url: 'https://inventarios-is.herokuapp.com/bodega/7/out',
                                data: {
                                    sku: item.product_code,
                                    quantity: item.quantity
                                }
                            }).then((externalApiResponse) => {
                                if (externalApiResponse.status === 200) {
                                    pool.query(
                                        `insert into sales_products
                  (
                    id_sale, id_bodega, sku, quantity, unit_price,
                    discount_percentage, total_product, 
                    total_discount, total, created_at, created_by
                  )
                  values($1,$2,$3,$4,$5,$6,$7,$8,$9,now() at time zone 'America/Guatemala',$10)`,
                                        [sales_result.rows[0].id_sale, id_bodega, item.product_code, item.quantity,
                                        item.unit_price, item.discount_percentage, item.total_product,
                                        item.total_discount, item.total, created_by
                                        ],
                                        (error, sales_products_reslt) => {
                                            if (error) {
                                                response.status(500).send('Algo exploto')
                                            }
                                        })
                                    send_external_sales_invoice(external_sale_id);
                                    response.send({ id: sales_result.rows[0].id_sale })
                                }
                            })
                        })
                    }
                }
            })
    }
}

const get_external_sales = (request, response) => {
    const id = request.params.external_sale_id;
    pool.query(`
	select massive_sale_id, external_sale_id, customer_id, invoice_id,
        total_sale, total_discount
            from sales
            where external_sale_id = $1`, [id],
        (error, results) => {
            if (error) {
                console.log('error', error)
                throw error
            }
            let body = results.rows

            pool.query(`
            select id_sale from sales where external_sale_id = $1;`, [id],
                (error2, results2) => {
                    if (error2) {
                        console.log('error', error2)
                        throw error2
                    }
                    let id_sale = results2.rows[0].id_sale

                    pool.query(`
                            select sku product_code, quantity, unit_price, discount_percentage,
                                total_product, total_discount, total
                                from sales_products
                                    where id_sale = $1 ;`, [id_sale],
                        (error3, results3) => {
                            if (error3) {
                                console.log('error', error3)
                                throw error3
                            }
                            body[0].products = results3.rows
                            response.status(200).json(body)
                        })
                })
        })
}

const get_external_sales_invoice = (request, response) => {
    const id = request.params.external_sale_id;
    pool.query(`
      select massive_sale_id, external_sale_id, customer_id, invoice_id,
          total_sale, total_discount
              from sales
              where external_sale_id = $1`, [id],
        (error, results) => {
            if (error) {
                console.log('error', error)
                throw error
            }
            let body = results.rows

            pool.query(`
              select id_sale from sales where external_sale_id = $1;`, [id],
                (error2, results2) => {
                    if (error2) {
                        console.log('error', error2)
                        throw error2
                    }
                    let id_sale = results2.rows[0].id_sale

                    pool.query(`
              select sku product_code, quantity, unit_price, discount_percentage,
                  total_product, total_discount, total
                  from sales_products
                      where id_sale = $1 ;`, [id_sale],
                        (error3, results3) => {
                            if (error3) {
                                console.log('error', error3)
                                throw error3
                            }
                            body[0].products = results3.rows
                            axios({
                                method: 'get',
                                url: 'https://ids-crm.herokuapp.com/api/costumer/read_single.php?nit=' + body[0].customer_id,
                            }).then(res => {
                                let info = res.data;
                                if (info.nit != null) {
                                    body[0].nombres = info.cname;
                                    body[0].direccion = info.caddress;
                                    body[0].email = info.cemail;
                                    createInvoice(body[0], response);
                                }
                            })
                        })
                })
        })
}

const get_internal_sales_invoice = (request, response) => {
    const id = request.params.sale_id;
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
                            createInvoiceInternal(body[0], response);
                        }
                    })
                })
        })
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

function send_external_sales_invoice(id){
    pool.query(`
      select massive_sale_id, external_sale_id, customer_id, invoice_id,
          total_sale, total_discount
              from sales
              where external_sale_id = $1`, [id],
        (error, results) => {
            if (error) {
                console.log('error', error)
                throw error
            }
            let body = results.rows

            pool.query(`
              select id_sale from sales where external_sale_id = $1;`, [id],
                (error2, results2) => {
                    if (error2) {
                        console.log('error', error2)
                        throw error2
                    }
                    let id_sale = results2.rows[0].id_sale

                    pool.query(`
              select sku product_code, quantity, unit_price, discount_percentage,
                  total_product, total_discount, total
                  from sales_products
                      where id_sale = $1 ;`, [id_sale],
                        (error3, results3) => {
                            if (error3) {
                                console.log('error', error3)
                                throw error3
                            }
                            body[0].products = results3.rows
                            axios({
                                method: 'get',
                                url: 'https://ids-crm.herokuapp.com/api/costumer/read_single.php?nit=' + body[0].customer_id,
                            }).then(res => {
                                let info = res.data;
                                if (info.nit != null) {
                                    body[0].nombres = info.cname;
                                    body[0].direccion = info.caddress;
                                    body[0].email = info.cemail;
                                    sendInvoice(body[0]);
                                }
                            })
                        })
                })
        })
}

module.exports = {
    create_external_sales,
    get_external_sales,
    get_external_sales_invoice,
    get_internal_sales_invoice
}