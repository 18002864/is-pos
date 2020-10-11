const { Pool, Client } = require('pg')

const pool = new Pool({
	user: 'postgres',
	host: 'is-pos.cpuskbampv3u.us-east-2.rds.amazonaws.com',
	database: 'pos',
	password: 'manchasymima',
	port: 5432,
})

const table_name = 'invoices'
const id_from_table = 'id_invoice'

const getInvoices = (request, response) => {
	pool.query(`select * from ${table_name}`, (error, results) => {
		if (error) {
			console.log('error', error)
			throw error
		}
		response.status(200).json(results.rows)
	})
}

const getInvoicesById = (request, response) => {
	const id = parseInt(request.params.id)
	pool.query(`SELECT * FROM ${table_name} WHERE ${id_from_table} = $1`, [id], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json(results.rows[0])
	})
}

const createInvoices = (request, response) => {
    const { invoice_pdf, invoice_sent, status, email_sent, id_point_of_sale,
        created_at, created_by, updated_at, updated_by } = request.body
    pool.query(`insert into ${table_name}
        (invoice_pdf, invoice_sent, status, email_sent,id_point_of_sale,
            created_at,created_by, updated_at, updated_by )
		    values($1,$2,null,null,null,null )`, 
		[invoice_pdf, invoice_sent, status, email_sent, id_point_of_sale], (error, results) => {
		if (error) {
			throw error
		}
		response.status(201).send(`Stores agregado ID: ${results.insertId}`)
	})
}

const updateInvoices = (request, response) => {
  const id = parseInt(request.params.id)
  const { invoice_pdf, invoice_sent, status, email_sent, id_point_of_sale,
    created_at, created_by, updated_at, updated_by } = request.body
  pool.query(
    `UPDATE ${table_name} 
        SET invoice_pdf = $1, 
            invoice_sent = $2,
            status = $3,
            email_sent = $4,
            id_point_of_sale = $5
            WHERE ${id_from_table} = $6`,
    [invoice_pdf, invoice_sent, status, email_sent, id_point_of_sale, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Producto modificado con ID: ${id}`)
    }
  )
}

const deleteInvoices = (request, response) => {
  const id = parseInt(request.params.id)
  pool.query(`DELETE FROM ${table_name} WHERE ${id_from_table} = $1`, [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Stores eliminado con ID: ${id}`)
  })
}

module.exports = {
	getInvoices,
	getInvoicesById,
	createInvoices,
	updateInvoices,
	deleteInvoices
}