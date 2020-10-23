const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
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

// // sales
// app.get('/sales', sales.getSales)
// app.get('/sales/:id', sales.getSalesById)
// app.post('/sales', sales.createSales)
// app.delete('/sales/:id', sales.deleteSale)
// app.put('/pointOfSasalesles/:id', sales.updateSales)

// // sales products
// app.get('/salesProducts', salesProducts.getSalesProducts)
// app.get('/salesProducts/:id', salesProducts.getSalesProductsById)
// app.post('/salesProducts', salesProducts.createSalesProducts)
// app.delete('/salesProducts/:id', salesProducts.deleteSalesProducts)
// app.put('/salesProducts/:id', salesProducts.updateSalesProducts)

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

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})