const { Pool, Client } = require('pg')

const pool = new Pool({
	user: 'postgres',
	host: 'is-pos.cpuskbampv3u.us-east-2.rds.amazonaws.com',
	database: 'pos',
	password: 'manchasymima',
	port: 5432,
})

const getProducts = (request, response) => {
	pool.query('select * from products', (error, results) => {
		if (error) {
			console.log('error', error)
			throw error
		}
		response.status(200).json(results.rows)
	})
}

const getProductById = (request, response) => {
	const id = parseInt(request.params.id)
	pool.query('SELECT * FROM products WHERE id_product = $1', [id], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json(results.rows[0])
	})
}

const createProduct = (request, response) => {
	const { product_name, description, created_at, created_by,
		updated_at, updated_by } = request.body
	pool.query(`insert into products(product_name, description, created_at,created_by, updated_at, updated_by )
		values($1,$2, Now(),null,Now(),null )`, 
		[product_name, description], (error, results) => {
		if (error) {
			throw error
		}
		response.status(201).send(`Producto agregado ID: ${results.insertId}`)
	})
}

const updateProducts = (request, response) => {
  const id = parseInt(request.params.id)
	const { product_name, description, created_at, created_by, updated_at, updated_by } = request.body
  pool.query(
    'UPDATE products SET product_name = $1, description = $2 WHERE id_product = $3',
    [product_name, description, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Producto modificado con ID: ${id}`)
    }
  )
}

const deleteProduct = (request, response) => {
  const id = parseInt(request.params.id)
  pool.query('DELETE FROM products WHERE id_product = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Producto eliminado con ID: ${id}`)
  })
}

const getProductsByAllFields = (request, response) => {
	pool.query(`
	select products.id_product, products.product_name, 
	store_products.unit_price, store_product_discounts.discount_percentage from products 
	inner join store_products ON products.id_product = store_products.id_product
	left join store_product_discounts ON products.id_product = store_product_discounts.id_product;`, 
	(error, results) => {
		if (error) {
			console.log('error', error)
			throw error
		}
		response.status(200).json(results.rows)
	})
}

module.exports = {
	getProducts,
	getProductById,
	createProduct,
	deleteProduct,
	updateProducts,
	getProductsByAllFields
}