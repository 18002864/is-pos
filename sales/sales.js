const { Pool, Client } = require('pg')

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
    const { id_store, id_point_of_sale, id_invoice, externally_created,
        total, total_discount, total_sale, status, is_delivery,
        created_at, created_by, updated_at, updated_by } = request.body

    pool.query(`insert into ${table_name}
        (id_store, id_point_of_sale, id_invoice, externally_created, 
            total, total_discount, total_sale, status,is_delivery, 
            created_at, created_by, updated_at, updated_by )
            values($1,$2,$3,$4,$5,$6,$7,$8,$9,Now(),null,Now(),null )`,
        [id_store, id_point_of_sale, id_invoice, externally_created,
            total, total_discount, total_sale, status, is_delivery],

        (error, results) => {
            if (error) {
                throw error
            }
            response.status(201).send(`Stores agregado ID: ${results.insertId}`)
        })
}

const updateSales = (request, response) => {
    const id = parseInt(request.params.id)
    const { id_store, id_point_of_sale, id_invoice, externally_created,
        total, total_discount, total_sale, status, is_delivery,
        created_at, created_by, updated_at, updated_by } = request.body
    pool.query(
        `UPDATE ${table_name} SET 
            id_store = $1, 
            id_point_of_sale = $2,
            id_invoice = $3,
            externally_created = $4,
            total = $5
            total_discount = $6, 
            total_sale = $7,
            status = $8,
            is_delivery = $9
            WHERE ${id_from_table} = $10`,
        [id_store, id_point_of_sale, id_invoice, externally_created,
            total, total_discount, total_sale, status, is_delivery, id],
        (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).send(`Producto modificado con ID: ${id}`)
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

const getSalesByCustomerId = (request, response) => {
	const id = request.params.id
	pool.query(`SELECT * FROM ${table_name} WHERE customer_id = $1`, [id], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json(results.rows)
	})
}

module.exports = {
    getSales,
    getSalesById,
    createSales,
    updateSales,
    deleteSale,
    getSalesByCustomerId
}