const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors')
const app = express()
const { Pool } = require('pg')


const PORT = process.env.PORT || 3000;




const sales = require('./sales/sales')
const salesProducts = require('./salesProducts/salesProducts')
const bodegas = require('./bodegas/bodegas')

const discounts = require('./discounts/discounts')

const external_sales = require('./external_sales/external_sales')
const reports = require('./reports/reports')
const dashboard = require('./dashboard/dashboard')
const returns = require('./returns/returns')
const inventory = require('./inventory/inventory')
const security = require('./security/security')
const { response } = require('express')



security.getJWTServiceLocalUse();



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

//    reports
app.get('/reports/nit/:nit',reports.getAllSalesFromClient)
app.get('/reports/allsales/:start/:end',reports.getAllSales)

//    dashboard
app.get('/dashboard',dashboard.dashboardData)

//    returns
app.get('/returns/invoice/:invoice',returns.getInvoiceProducts)
app.post('/returns/update',returns.postReturn)
app.delete('/returns/delete/:invoice',returns.deleteReturnedInvoice)

//    consulta bodega inventario
app.get("/inventory/:id_bodega",inventory.getProducts);

//    obtener JWT de seguridad 
app.get("/security",security.getJWTService);


//   discounts
app.get('/discounts/id_bodega/:id_bodega', discounts.getDiscounts)
app.get('/discounts/:id', discounts.getDiscountsById)
app.post('/discounts', discounts.createDiscounts)
app.delete('/discounts/:id', discounts.deleteDiscounts)
app.put('/discounts/:id', discounts.updateDiscounts)
app.get('/discounts/id_bodega/:id_bodega/sku/:sku', discounts.getDiscountsSKU)
app.get('/discounts/id_bodega/:id_bodega/sku/:sku', discounts.getDiscountsByActiveProduct)

// // sales
app.get('/sales', sales.getSales)
app.get('/sales/:id', sales.getSalesById)
app.get('/sales/customer/:id', sales.getSalesByCustomerId)
app.post('/sales', sales.createSales)
app.delete('/sales/:id', sales.deleteSale)
app.put('/pointOfSasalesles/:id', sales.updateSales)

// para sales
app.post('/pos/:pos_id/external-sales', external_sales.create_external_sales)
app.get('/pos/:pos_id/external-sales/:external_sale_id', external_sales.get_external_sales)
app.get('/pos/:pos_id/external-sales/:external_sale_id/invoice', external_sales.get_external_sales_invoice)
app.get('/pos/:pos_id/internal-sales/:sale_id/invoice', external_sales.get_internal_sales_invoice)

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

// bodegas
app.get('/bodegas', bodegas.getBodegas)

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

app.use(function(req, res, next) {
  respuesta = {
   error: true, 
   codigo: 404, 
   mensaje: 'URL no encontrada'
  };
  res.status(404).send(respuesta);
 });

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});

