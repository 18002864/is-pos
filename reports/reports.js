const { Pool, Client } = require('pg')

const pool = new Pool({
	user: 'postgres',
	host: 'is-pos.cpuskbampv3u.us-east-2.rds.amazonaws.com',
	database: 'pos',
	password: 'manchasymima',
	port: 5432,
})

const getAllSalesFromClient = (request, response) => {
	const nit = parseInt(request.params.nit);
	pool.query(`
	SELECT sales_products.* FROM sales
	INNER JOIN sales_products ON sales.id_sale = sales_products.id_sale
	WHERE customer_id = $1	`,[nit], (error, results) => {
		if (error) {
			console.log('error', error)
			throw error
		}
		response.status(200).json(results.rows)
	})
}

const getAllSales = (request, response) => {
	const startDate = request.params.start;
	const endDate = request.params.end;
	pool.query(`SELECT * FROM sales_products
	WHERE  created_at BETWEEN $1 AND $2	`,[startDate,endDate], (error, results) => {
		if (error) {
			console.log('error', error)
			throw error
		}
		//console.log(results.rows)
		response.status(200).json(results.rows)
	})
}

module.exports = {
	getAllSalesFromClient,
	getAllSales
}