const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors')
const app = express()
const { Pool } = require('pg')
const PORT = process.env.PORT || 3000;

const products = require('./products/products')
const stores = require('./stores/stores')
const pointOfSales = require('./pointOfSales/pointOfSales')
const invoices = require('./invoices/invoices')
const sales = require('./sales/sales')
const salesProducts = require('./salesProducts/salesProducts')
const storeProducts = require('./storeProducts/storeProducts')
const productDiscounts = require('./productDiscounts/productDiscounts')
const storeProductsDiscounts = require('./storeProductDiscounts/storeProductDiscounts')
const productDiscountsCoupons = require('./productDiscountCoupons/productDiscountCoupons')

const discounts = require('./discounts/discounts')

app.use(cors())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})



//   discounts
app.get('/discounts', discounts.getDiscounts)
app.get('/discounts/:id', discounts.getDiscountsById)
app.post('/discounts', discounts.createDiscounts)
app.delete('/discounts/:id', discounts.deleteDiscounts)
app.put('/discounts/:id', discounts.updateDiscounts)
app.get('/discounts/sku/:sku', discounts.getDiscountsSKU)
app.get('/discounts/id_bodega/:id_bodega/sku/:sku', discounts.getDiscountsByActiveProduct)


// // sales
app.get('/sales', sales.getSales)
app.get('/sales/:id', sales.getSalesById)
app.get('/sales/customer/:id', sales.getSalesByCustomerId)
app.post('/sales', sales.createSales)
app.delete('/sales/:id', sales.deleteSale)
app.put('/pointOfSasalesles/:id', sales.updateSales)
app.post('/pos/2/external-sales', (request, response) => {

  const pool = new Pool({
    user: 'postgres',
    host: 'is-pos.cpuskbampv3u.us-east-2.rds.amazonaws.com',
    database: 'pos',
    password: 'manchasymima',
    port: 5432,
  })

  const {
    massive_sale_id,
    customer_id, total_sale,
    total_discount
  } = request.body

  const { products } = request.body

  const id_bodega = 7
  const created_by = 'socio'

  pool.query(`insert into sales
  (id_bodega, massive_sale_id, customer_id, total_sale, total_discount,
      created_at, created_by) values($1,$2,$3,$4,$5,Now(),$6) RETURNING id_sale`,
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
                values($1,$2,$3,$4,$5,$6,$7,$8,$9,Now(),$10)`,
                  [sales_result.rows[0].id_sale, id_bodega, item.product_code, item.quantity,
                  item.unit_price, item.discount_percentage, item.total_product,
                  item.total_discount, total_sale, created_by
                  ],
                  (error, sales_products_reslt) => {
                    if (error) {
                      response.status(500).send('Algo exploto')
                    }
                  })
                response.send({ id: sales_result.rows[0].id_sale })
              }
            })
          })
        }
      }
    })
})

// https://ids-crm.herokuapp.com/api/costumer/create.php

app.post('/create/client', (request, response) => {
  const { nit, dpi, cname, cdob, cphone, caddress, cemail, ccompany } = request.body
  axios({
    method: 'post',
    url: 'https://ids-crm.herokuapp.com/api/costumer/create.php',
    data: { nit, dpi, cname, cdob, cphone, caddress, cemail, ccompany }
  }).then(res => {
    if (res.status === 200) {
      response.status(200).send('OK')
    }
  })
})



// // sales products
app.get('/salesProducts', salesProducts.getSalesProducts)
app.get('/salesProducts/:id', salesProducts.getSalesProductsById)
app.post('/salesProducts', salesProducts.createSalesProducts)
app.delete('/salesProducts/:id', salesProducts.deleteSalesProducts)
app.put('/salesProducts/:id', salesProducts.updateSalesProducts)
app.get('/salesProducts/sale/:id', salesProducts.getSalesProductsBySalesId)


app.post('/auth', (request, response) => {
  const { username, password } = request.body
  axios({
    method: 'post',
    url: 'https://auth.zer0th.com/api/node/user/auth',
    data: { username, password }
  }).then(res => {
    if (res.status === 200) {
      
      response.send(res.data)
    }
  })
})

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})