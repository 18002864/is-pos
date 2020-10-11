const { Pool, Client } = require('pg')

const pool = new Pool({
	user: 'postgres',
	host: 'is-pos.cpuskbampv3u.us-east-2.rds.amazonaws.com',
	database: 'pos',
	password: 'manchasymima',
	port: 5432,
})

const table_name = 'sales_products'
const id_from_table = 'id_sale_product'


const getSalesProducts = (request, response) => {
	pool.query(`select * from ${table_name}`, (error, results) => {
		if (error) {
			console.log('error', error)
			throw error
		}
		response.status(200).json(results.rows)
	})
}

const getSalesProductsById = (request, response) => {
	const id = parseInt(request.params.id)
	pool.query(`SELECT * FROM ${table_name} WHERE ${id_from_table} = $1`, [id], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json(results.rows[0])
	})
}


const createSalesProducts = (request, response) => {

	const { id_store, id_point_of_sale, id_sale, quantity,
		unit_price, discount_percentage, total_price,
		created_at, created_by, updated_at, updated_by } = request.body

	pool.query(`insert into ${table_name}
        (
        id_store, id_point_of_sale, id_sale, quantity,
        unit_price, discount_percentage, total_price,
				created_at, created_by, updated_at, updated_by)
				
        values($1,$2,$3,$4,$5,$6,$7,Now(),null,Now(),null )`,

		[
			id_store, id_point_of_sale, id_sale, quantity,
			unit_price, discount_percentage, total_price
		],

		(error, results) => {
			if (error) {
				throw error
			}
			response.status(201).send(`Stores agregado ID: ${results.insertId}`)
		})
}

const updateSalesProducts = (request, response) => {
	const id = parseInt(request.params.id)

	const { id_store, id_point_of_sale, id_sale, quantity,
		unit_price, discount_percentage, total_price,
		created_at, created_by, updated_at, updated_by } = request.body

	pool.query(
		`UPDATE ${table_name} SET 
            id_store = $1, 
            id_point_of_sale = $2,
            id_sale = $3,
            quantity = $4,
            unit_price = $5
            discount_percentage = $6, 
            total_price = $7
						WHERE ${id_from_table} = $8`,
		[
			id_store, id_point_of_sale, id_sale, quantity,
			unit_price, discount_percentage, total_price, id
		],


		(error, results) => {
			if (error) {
				throw error
			}
			response.status(200).send(`Producto modificado con ID: ${id}`)
		}
	)
}

const deleteSalesProducts = (request, response) => {
	const id = parseInt(request.params.id)
	pool.query(`DELETE FROM ${table_name} WHERE ${id_from_table} = $1`, [id], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).send(`Stores eliminado con ID: ${id}`)
	})
}

module.exports = {
	getSalesProducts,
	getSalesProductsById,
	createSalesProducts,
	updateSalesProducts,
	deleteSalesProducts
}