const { Pool, Client } = require('pg')
const axios = require('axios')

const pool = new Pool({
	user: 'postgres',
	host: 'is-pos.cpuskbampv3u.us-east-2.rds.amazonaws.com',
	database: 'pos',
	password: 'manchasymima',
	port: 5432,
})

const table_name = 'sales'
const id_from_table = 'id_sale'



const getSales = (request, response) => {
	pool.query(`select * from ${table_name}`, (error, results) => {
		if (error) {
			console.log('error', error)
			throw error
		}
		response.status(200).json(results.rows)
	})
}

const getSalesById = (request, response) => {
	const id = parseInt(request.params.id)
	pool.query(`SELECT * FROM ${table_name} WHERE ${id_from_table} = $1`, [id], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json(results.rows[0])
	})
}

const createSales = (request, response) => {
	const { id_bodega, massive_sale_id, customer_id, total_sale, total_discount,
		created_at, created_by } = request.body

	pool.query(`insert into ${table_name}
        (id_bodega, massive_sale_id, customer_id, total_sale, total_discount,
            created_at, created_by) values($1,$2,$3,$4,$5,Now(),$6) RETURNING ${id_from_table}`,
		[
			id_bodega, massive_sale_id, customer_id, total_sale, total_discount,
			created_at, created_by
		],

		(error, results) => {
			if (error) {
				throw error
			}
			response.status(201).send(results.insertId)
		})
}

const updateSales = (request, response) => {
	const id = parseInt(request.params.id)
	const { id_bodega, massive_sale_id, customer_id, total_sale, total_discount,
		created_at, created_by } = request.body
	pool.query(
		`UPDATE ${table_name} SET 
            id_bodega = $1, 
            massive_sale_id = $2,
            customer_id = $3,
            total_sale = $4,
            total_discount = $5,
            created_at = $6, 
            created_by = $7
            WHERE ${id_from_table} = $8`,
		[id_bodega, massive_sale_id, customer_id, total_sale,
			total_discount, created_at, created_by, id],
		(error, results) => {
			if (error) {
				throw error
			}
			response.status(200).send(`Sales`)
		}
	)
}

const deleteSale = (request, response) => {
	const id = parseInt(request.params.id)
	pool.query(`DELETE FROM ${table_name} WHERE ${id_from_table} = $1`, [id], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).send(`Stores eliminado con ID: ${id}`)
	})
}

const externalSales = (request, response) => {
	// Send a POST request
	// axios({
	// 	method: 'post',
	// 	url: 'https://inventarios-is.herokuapp.com/pos/7/external-sales',
	// 	data: {
	// 		firstName: 'Fred',
	// 		lastName: 'Flintstone'
	// 	}
	// })
	// pool.query(`select * from ${table_name}`, (error, results) => {
	// 	if (error) {
	// 		console.log('error', error)
	// 		throw error
	// 	}
	// 	response.status(200).json(results.rows)
	// })
	// https://inventarios-is.herokuapp.com/pos/7/external-sales

	// {
	// 	"massive_sale_id": 12345,
	// 		"customer_id": 20,
	// 			"total_sale": 69.25,
	// 				"total_discount": 10.75,
	// 					"products": [
	// 						{
	// 							"product_code": "JU_NAR_1LI",
	// 							"quantity": 10,
	// 							"unit_price": 5.5,
	// 							"discount_percentage": 15,
	// 							"total_product": 55,
	// 							"total_discount": 8.25,
	// 							"total": 46.75
	// 						},
	// 						{
	// 							"product_code": "JU_NAR_500ML",
	// 							"quantity": 10,
	// 							"unit_price": 2.5,
	// 							"discount_percentage": 10,
	// 							"total_product": 25,
	// 							"total_discount": 2.5,
	// 							"total": 22.5
	// 						}
	// 					]
	// }
}


module.exports = {
	getSales,
	getSalesById,
	createSales,
	updateSales,
	deleteSale,
	externalSales
}


// Esquema del finalito:

// 1. Problema de funciones ortogonales. 15 puntos.

// 2. Cálculo de una serie de fourier.   15 puntos

// 3. Forma ángulo fase, 5 puntos. 

// 3.  Serie de calcular transformadas. 20 puntos.

// 4. Serie de calcular transformadas inversas. 20 puntos.

// 5. Ecuación diferencial con series 10 puntos.

// 6. Ecuación diferencial con transformadas 15 puntos.