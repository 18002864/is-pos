const { Pool, Client } = require('pg')

const pool = new Pool({
	user: 'postgres',
	host: 'is-pos.cpuskbampv3u.us-east-2.rds.amazonaws.com',
	database: 'pos',
	password: 'manchasymima',
	port: 5432,
})

const table_name = 'product_discounts'
const id_from_table = 'id_product_discount'


const getProductDiscounts = (request, response) => {
	pool.query(`select * from ${table_name}`, (error, results) => {
		if (error) {
			console.log('error', error)
			throw error
		}
		response.status(200).json(results.rows)
	})
}

const getProductDiscountsById = (request, response) => {
	const id = parseInt(request.params.id)
	pool.query(`SELECT * FROM ${table_name} WHERE ${id_from_table} = $1`, [id], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json(results.rows[0])
	})
}

const createProductDiscounts = (request, response) => {

	const {
		id_product, minimun_quantity, discount_percentage,
		discount_starts, discount_ends,
		created_at, created_by, updated_at, updated_by } = request.body

	pool.query(`insert into ${table_name}
        (
					id_product, minimun_quantity, discount_percentage, 
					discount_starts, discount_ends,
					created_at, created_by, updated_at, updated_by
				)
				values($1,$2,$3,$4,$5,Now(),null,Now(),null )`,

		[
			id_product, minimun_quantity, discount_percentage,
			discount_starts, discount_ends
		],

		(error, results) => {
			if (error) {
				throw error
			}
			response.status(201).send(`Stores agregado ID: ${results.insertId}`)
		})
}

const updateProductDiscounts = (request, response) => {
	const id = parseInt(request.params.id)

	const { id_product, minimun_quantity, discount_percentage,
		discount_starts, discount_ends,
		created_at, created_by, updated_at, updated_by  } = request.body

	pool.query(
		`UPDATE ${table_name} SET 
			id_product = $1, 
			minimun_quantity = $2,
			discount_percentage = $3,
			discount_starts = $4,
			discount_ends = $5
						WHERE ${id_from_table} = $6`,
		[
			id_product, minimun_quantity, discount_percentage,
			discount_starts, discount_ends, id
		],

		(error, results) => {
			if (error) {
				throw error
			}
			response.status(200).send(`Producto modificado con ID: ${id}`)
		}
	)
}

const deleteProductDiscounts = (request, response) => {
	const id = parseInt(request.params.id)
	pool.query(`DELETE FROM ${table_name} WHERE ${id_from_table} = $1`, [id], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).send(`Stores eliminado con ID: ${id}`)
	})
}

module.exports = {
	getProductDiscounts,
	getProductDiscountsById,
	createProductDiscounts,
	updateProductDiscounts,
	deleteProductDiscounts
}