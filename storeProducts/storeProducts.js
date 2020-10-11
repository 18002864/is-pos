const { Pool, Client } = require('pg')

const pool = new Pool({
	user: 'postgres',
	host: 'is-pos.cpuskbampv3u.us-east-2.rds.amazonaws.com',
	database: 'pos',
	password: 'manchasymima',
	port: 5432,
})

const table_name = 'store_products'
const id_from_table = 'id_store_product'


const getStoreProducts = (request, response) => {
	pool.query(`select * from ${table_name}`, (error, results) => {
		if (error) {
			console.log('error', error)
			throw error
		}
		response.status(200).json(results.rows)
	})
}

const getStoreProductsById = (request, response) => {
	const id = parseInt(request.params.id)
	pool.query(`SELECT * FROM ${table_name} WHERE ${id_from_table} = $1`, [id], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json(results.rows[0])
	})
}

const createStoreProducts = (request, response) => {

	const { id_store, id_product, unit_price, status,
		created_at, created_by, updated_at, updated_by } = request.body

	pool.query(`insert into ${table_name}
        (
					id_store, id_product, unit_price, status,
					created_at, created_by, updated_at, updated_by
				)
				values($1,$2,$3,$4,Now(),null,Now(),null )`,
				
		[
			id_store, id_product, unit_price, status
		],

		(error, results) => {
			if (error) {
				throw error
			}
			response.status(201).send(`Stores agregado ID: ${results.insertId}`)
		})
}

const updateStoreProducts = (request, response) => {
	const id = parseInt(request.params.id)

	const { id_store, id_product, unit_price, status,
		created_at, created_by, updated_at, updated_by } = request.body

	pool.query(
		`UPDATE ${table_name} SET 
            id_store = $1, 
            id_product = $2,
            unit_price = $3,
            status = $4
						WHERE ${id_from_table} = $5`,
		[
			id_store, id_product, unit_price, status,
			created_at, created_by, updated_at, updated_by, id
		],

		(error, results) => {
			if (error) {
				throw error
			}
			response.status(200).send(`Producto modificado con ID: ${id}`)
		}
	)
}

const deleteStoreProducts = (request, response) => {
	const id = parseInt(request.params.id)
	pool.query(`DELETE FROM ${table_name} WHERE ${id_from_table} = $1`, [id], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).send(`Stores eliminado con ID: ${id}`)
	})
}

module.exports = {
	getStoreProducts,
	getStoreProductsById,
	createStoreProducts,
	updateStoreProducts,
	deleteStoreProducts
}