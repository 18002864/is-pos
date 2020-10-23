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

// id_sale INT NOT NULL,		
// id_bodega INT NOT NULL,
// sku varchar(12),
// quantity INT,
// unit_price float,
// discount_percentage int,
// total_product float,
// total_discount float,
// total float,
// created_at DATE,
// created_by VARCHAR ( 50 ),

const createSalesProducts = (request, response) => {

    const { id_sale, id_bodega, sku, quantity, unit_price,
        discount_percentage, total_product, total_discount, total,
        created_at, created_by } = request.body

	pool.query(`insert into ${table_name}
        (id_sale, id_bodega, sku, quantity, unit_price,
            discount_percentage, total_product, total_discount, total,
            created_at, created_by)
        values($1,$2,$3,$4,$5,$6,$7,$8,$9,Now(),$11)`,

		[
            id_sale, id_bodega, sku, quantity, unit_price,
            discount_percentage, total_product, total_discount, total,
            created_at, created_by
		],

		(error, results) => {
			if (error) {
				throw error
			}
			response.status(201).send(`sales product ingresao`)
		})
}

const updateSalesProducts = (request, response) => {
	const id = parseInt(request.params.id)

	const { id_sale, id_bodega, sku, quantity, unit_price,
        discount_percentage, total_product, total_discount, total,
        created_at, created_by} = request.body

	pool.query(
		`UPDATE ${table_name} SET 
            id_sale = $1, 
            id_bodega = $2,
            sku = $3,
            quantity = $4,
            unit_price = $5,
            discount_percentage = $6,
            total_product = $7,
            total_discount = $8,
            total = $9,
            created_at = $10,
            created_at = $11
			WHERE ${id_from_table} = $12`,
		[
            id_sale, id_bodega, sku, quantity, unit_price,
            discount_percentage, total_product, total_discount, total,
            created_at, created_by, id
		],


		(error, results) => {
			if (error) {
				throw error
			}
			response.status(200).send(`sales product modificao`)
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