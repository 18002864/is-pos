const { Pool, Client } = require('pg')

const pool = new Pool({
	user: 'postgres',
	host: 'is-pos.cpuskbampv3u.us-east-2.rds.amazonaws.com',
	database: 'pos',
	password: 'manchasymima',
	port: 5432,
})

const getStores = (request, response) => {
	pool.query('select * from stores', (error, results) => {
		if (error) {
			console.log('error', error)
			throw error
		}
		response.status(200).json(results.rows)
	})
}

const getStoreById = (request, response) => {
	const id = parseInt(request.params.id)
	pool.query('SELECT * FROM stores WHERE id_store = $1', [id], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json(results.rows[0])
	})
}

const createStore = (request, response) => {
	const { slug, store_name, address, created_at, created_by,
		updated_at, updated_by } = request.body
    pool.query(`insert into stores
        (slug, store_name,address, created_at,created_by, updated_at, updated_by )
		values($1,$2,$3,null,null,null,null )`, 
		[slug, store_name,address], (error, results) => {
		if (error) {
			throw error
		}
		response.status(201).send(`Stores agregado ID: ${results.insertId}`)
	})
}

const updateStore = (request, response) => {
  const id = parseInt(request.params.id)
  const { slug, store_name, address, created_at, created_by,
    updated_at, updated_by } = request.body
  pool.query(
    'UPDATE stores SET slug = $1, store_name = $2, address = $3 WHERE id_store = $4',
    [slug, store_name,address, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Producto modificado con ID: ${id}`)
    }
  )
}

const deleteStore = (request, response) => {
  const id = parseInt(request.params.id)
  pool.query('DELETE FROM stores WHERE id_store = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Stores eliminado con ID: ${id}`)
  })
}

module.exports = {
	getStores,
	getStoreById,
	createStore,
	updateStore,
	deleteStore
}