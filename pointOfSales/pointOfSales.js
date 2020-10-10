const { Pool, Client } = require('pg')

const pool = new Pool({
	user: 'postgres',
	host: 'is-pos.cpuskbampv3u.us-east-2.rds.amazonaws.com',
	database: 'pos',
	password: 'manchasymima',
	port: 5432,
})

const table_name = 'point_of_sales'
const id_from_table = 'id_point_of_sale'

const getPointOfSales = (request, response) => {
	pool.query(`select * from ${table_name}`, (error, results) => {
		if (error) {
			console.log('error', error)
			throw error
		}
		response.status(200).json(results.rows)
	})
}

const getPointOfSalesById = (request, response) => {
	const id = parseInt(request.params.id)
	pool.query(`SELECT * FROM ${table_name} WHERE ${id_from_table} = $1`, [id], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json(results.rows[0])
	})
}

const createPointOfSales = (request, response) => {
	const { id_store, terminal_number, created_at, created_by,
		updated_at, updated_by } = request.body
    pool.query(`insert into ${table_name}
        (id_store, terminal_number, created_at,created_by, updated_at, updated_by )
		values($1,$2,null,null,null,null )`, 
		[id_store, terminal_number], (error, results) => {
		if (error) {
			throw error
		}
		response.status(201).send(`Stores agregado ID: ${results.insertId}`)
	})
}

const updatePointOfSales = (request, response) => {
  const id = parseInt(request.params.id)
  const { id_store, terminal_number, created_at, created_by,
    updated_at, updated_by } = request.body
  pool.query(
    `UPDATE ${table_name} SET id_store = $1, terminal_number = $2 WHERE ${id_from_table} = $3`,
    [id_store, terminal_number, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Producto modificado con ID: ${id}`)
    }
  )
}

const deletePointOfSales = (request, response) => {
  const id = parseInt(request.params.id)
  pool.query(`DELETE FROM ${table_name} WHERE ${id_from_table} = $1`, [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Stores eliminado con ID: ${id}`)
  })
}

module.exports = {
	getPointOfSales,
	getPointOfSalesById,
	createPointOfSales,
	updatePointOfSales,
	deletePointOfSales
}