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

// id_bodega INT NOT NULL,
// massive_sale_id INT,
// customer_id varchar(20),
// total_sale float,	
// total_discount float,
// created_at DATE,
// created_by VARCHAR ( 50 )

const createSales = (request, response) => {
    const { id_bodega, massive_sale_id, customer_id, total_sale, total_discount,
        created_at, created_by } = request.body

    pool.query(`insert into ${table_name}
        (id_bodega, massive_sale_id, customer_id, total_sale, total_discount,
            created_at, created_by) values($1,$2,$3,$4,$5,$6,$7)`,
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

module.exports = {
    getSales,
    getSalesById,
    createSales,
    updateSales,
    deleteSale
}


// Esquema del finalito:

// 1. Problema de funciones ortogonales. 15 puntos.

// 2. Cálculo de una serie de fourier.   15 puntos

// 3. Forma ángulo fase, 5 puntos. 

// 3.  Serie de calcular transformadas. 20 puntos.

// 4. Serie de calcular transformadas inversas. 20 puntos.

// 5. Ecuación diferencial con series 10 puntos.

// 6. Ecuación diferencial con transformadas 15 puntos.