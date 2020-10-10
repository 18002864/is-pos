const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./wtf')
const PORT = process.env.PORT || 3000;

const products = require('./products/products')


app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/products', products.getProducts)
app.get('/products/:id', products.getProductById)
app.post('/products', products.createProduct)
app.delete('/products/:id', products.deleteProduct)
app.put('/products/:id', products.updateProducts)

app.get('/stores', db.getStores)
app.get('/users', db.getUsers)

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})