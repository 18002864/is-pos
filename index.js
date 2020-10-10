const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./wtf')
const PORT = process.env.PORT || 3000;

const products = require('./products/products')
const stores = require('./stores/stores')
const pointOfSales = require('./pointOfSales/pointOfSales')

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})


// productos
app.get('/products', products.getProducts)
app.get('/products/:id', products.getProductById)
app.post('/products', products.createProduct)
app.delete('/products/:id', products.deleteProduct)
app.put('/products/:id', products.updateProducts)

// stores
app.get('/stores', stores.getStores)
app.get('/stores/:id', stores.getStoreById)
app.post('/stores', stores.createStore)
app.delete('/stores/:id', stores.deleteStore)
app.put('/stores/:id', stores.updateStore)

// point of sales
app.get('/pointOfSales', pointOfSales.getPointOfSales)
app.get('/pointOfSales/:id', pointOfSales.getPointOfSalesById)
app.post('/pointOfSales', pointOfSales.createPointOfSales)
app.delete('/pointOfSales/:id', pointOfSales.deletePointOfSales)
app.put('/pointOfSales/:id', pointOfSales.updatePointOfSales)

app.get('/users', db.getUsers)

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})