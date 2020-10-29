const { Pool, Client } = require('pg')

const pool = new Pool({
	user: 'postgres',
	host: 'is-pos.cpuskbampv3u.us-east-2.rds.amazonaws.com',
	database: 'pos',
	password: 'manchasymima',
	port: 5432,
})

const table_name = 'product_discount'
const id_from_table = 'id_discount'


const getDiscounts = (request, response) => {
	pool.query(`select * from ${table_name}`, (error, results) => {
		if (error) {
			console.log('error', error)
			throw error
		}
		response.status(200).json(results.rows)
	})
}

const getDiscountsById = (request, response) => {
	const id = parseInt(request.params.id)
	pool.query(`SELECT * FROM ${table_name} WHERE ${id_from_table} = $1`, [id], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json(results.rows[0])
	})
}

// id_bodega   int not null,
// sku         varchar(12),
// name        varchar(200),
// descripcion varchar(500),
// discount    float,
// starts      date,
// ends        date 

const createDiscounts = (request, response) => {
	const { id_bodega, sku, name, descripcion, discount, starts, ends } = request.body
	pool.query(`insert into ${table_name}
        (id_bodega, sku, name, descripcion, discount, starts, ends) values($1,$2,$3,$4,$5,$6,$7)`,
		[id_bodega, sku, name, descripcion, discount, starts, ends],
		(error, results) => {
			if (error) {
				throw error
			}
			response.status(201).send(`SE HA AGREGADO CON EXITO`)
		})
}

const updateDiscounts = (request, response) => {
	const id = parseInt(request.params.id)
	const { id_bodega, sku, name, descripcion, discount, starts, ends } = request.body
	pool.query(
		`UPDATE ${table_name} SET 
        id_bodega = $1, 
		sku = $2,
		name = $3,
		descripcion = $4,
		discount = $5,
        starts = $6,
        ends = $7 WHERE ${id_from_table} = $8`,
		[id_bodega, sku, name, descripcion, discount, starts, ends, id],
		(error, results) => {
			if (error) {
				throw error
			}
			response.status(200).send(`Modificado con exito`)
		}
	)
}

const deleteDiscounts = (request, response) => {
	const id = parseInt(request.params.id)
	pool.query(`DELETE FROM ${table_name} WHERE ${id_from_table} = $1`, [id], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).send(`Eliminado con exito`)
	})
}

const getDiscountsSKU = (request, response) => {
	const sku = request.params.sku
	pool.query(`SELECT * FROM ${table_name} WHERE sku LIKE $1`, [sku], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json(results.rows)
	})
}

const getDiscountsByActiveProduct = (request, response) => {
	const id_bodega = request.params.id_bodega
	const sku = request.params.sku
	
	pool.query(`
		select sku, COALESCE (max(discount), 0 , max(discount)) as discount from product_discount
		  where id_bodega = $1 and sku = $2 and now() between starts and ends+1 group by sku`, 
		  [id_bodega, sku], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json(results.rows)
	})
}

module.exports = {
	getDiscounts,
	getDiscountsById,
	createDiscounts,
	updateDiscounts,
	deleteDiscounts,
	getDiscountsSKU,
	getDiscountsByActiveProduct
}