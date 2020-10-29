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

// // productos
// app.get('/products', products.getProducts)
// //app.get('/products/:id', products.getProductById)
// app.post('/products', products.createProduct)
// app.delete('/products/:id', products.deleteProduct)
// app.put('/products/:id', products.updateProducts)
// app.get('/products/details', products.getProductsByAllFields)

// // stores
// app.get('/stores', stores.getStores)
// app.get('/stores/:id', stores.getStoreById)
// app.post('/stores', stores.createStore)
// app.delete('/stores/:id', stores.deleteStore)
// app.put('/stores/:id', stores.updateStore)

// // point of sales
// app.get('/pointOfSales', pointOfSales.getPointOfSales)
// app.get('/pointOfSales/:id', pointOfSales.getPointOfSalesById)
// app.post('/pointOfSales', pointOfSales.createPointOfSales)
// app.delete('/pointOfSales/:id', pointOfSales.deletePointOfSales)
// app.put('/pointOfSales/:id', pointOfSales.updatePointOfSales)

// // invoices
// app.get('/invoices', invoices.getInvoices)
// app.get('/invoices/:id', invoices.getInvoicesById)
// app.post('/invoices', invoices.createInvoices)
// app.delete('/invoices/:id', invoices.deleteInvoices)
// app.put('/invoices/:id', invoices.updateInvoices)

// // store products
// app.get('/storeProducts', storeProducts.getStoreProducts)
// app.get('/storeProducts/:id', storeProducts.getStoreProductsById)
// app.post('/storeProducts', storeProducts.createStoreProducts)
// app.delete('/storeProducts/:id', storeProducts.deleteStoreProducts)
// app.put('/storeProducts/:id', storeProducts.updateStoreProducts)

// // product discounts
// app.get('/productDiscounts', productDiscounts.getProductDiscounts)
// app.get('/productDiscounts/:id', productDiscounts.getProductDiscountsById)
// app.post('/productDiscounts', productDiscounts.createProductDiscounts)
// app.delete('/productDiscounts/:id', productDiscounts.deleteProductDiscounts)
// app.put('/productDiscounts/:id', productDiscounts.updateProductDiscounts)

// // store products discount
// app.get('/storeProductsDiscounts', storeProductsDiscounts.getStoreProductDiscounts)
// app.get('/storeProductsDiscounts/:id', storeProductsDiscounts.getStoreProductDiscountsById)
// app.post('/storeProductsDiscounts', storeProductsDiscounts.createStoreProductDiscounts)
// app.delete('/storeProductsDiscounts/:id', storeProductsDiscounts.deleteStoreProductDiscounts)
// app.put('/storeProductsDiscounts/:id', storeProductsDiscounts.updateStoreProductDiscounts)

// // product Discounts Coupons
// app.get('/productDiscountsCoupons', productDiscountsCoupons.getProductDiscountCoupons)
// app.get('/productDiscountsCoupons/:id', productDiscountsCoupons.getProductDiscountCouponsById)
// app.post('/productDiscountsCoupons', productDiscountsCoupons.createProductDiscountCoupons)
// app.delete('/productDiscountsCoupons/:id', productDiscountsCoupons.deleteProductDiscountCoupons)
// app.put('/productDiscountsCoupons/:id', productDiscountsCoupons.updateProductDiscountCoupons)


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
app.post('/sales', sales.createSales)
app.delete('/sales/:id', sales.deleteSale)
app.put('/pointOfSasalesles/:id', sales.updateSales)
app.post('/pos/2/external', (request, response) => {

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
                response.status(200).send(sales_result.rows[0].id_sale)
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
  }).then(res => console.log('------>', res))
})


// // sales products
app.get('/salesProducts', salesProducts.getSalesProducts)
app.get('/salesProducts/:id', salesProducts.getSalesProductsById)
app.post('/salesProducts', salesProducts.createSalesProducts)
app.delete('/salesProducts/:id', salesProducts.deleteSalesProducts)
app.put('/salesProducts/:id', salesProducts.updateSalesProducts)



app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})