const { Pool, Client } = require('pg')
const axios = require('axios')

const pool = new Pool({
	user: 'postgres',
	host: 'is-pos.cpuskbampv3u.us-east-2.rds.amazonaws.com',
	database: 'pos',
	password: 'manchasymima',
	port: 5432,
})

const dashboardData = async (request, response) => {
	try {

		var daily_sales = await pool.query(`
		SELECT created_at, EXTRACT(DAY FROM created_at), SUM(total_sale) FROM sales
		WHERE created_at >= now() at time zone 'America/Guatemala' - INTERVAL '6 day'
		GROUP BY created_at
		ORDER BY created_at	`, []);

		var top_products = await pool.query(`
		SELECT created_at, EXTRACT(DAY FROM created_at),sku, SUM(total_product) FROM sales_products
		WHERE created_at >= now() at time zone 'America/Guatemala' - INTERVAL '6 day'
		AND sku IN (SELECT sku FROM (SELECT sku, SUM(total_product) FROM sales_products GROUP BY sku ORDER BY 2 DESC LIMIT 2) AS A)
		GROUP BY created_at, sku
		ORDER BY created_at,sku`, []);

		var money_in_stock = 0;
		//inventario
		var stock = await axios.get('https://inventarios-is.herokuapp.com/bodega/7');
		if (stock.status == 200) {
			for (var i = 0; i < stock.data.products.length; i++) {
				money_in_stock += parseFloat(stock.data.products[i].price) * parseInt(stock.data.products[i].quantity);
			}
		}

		var returns = await pool.query(`
		SELECT SUM(quantity) FROM sales_returns
		WHERE created_at >= now() at time zone 'America/Guatemala' - INTERVAL '6 day'`, []);
		var returns_chart = await pool.query(`
		SELECT sku, SUM(quantity) FROM sales_returns
		WHERE created_at >= now() at time zone 'America/Guatemala' - INTERVAL '6 day'
		AND sku IN (SELECT sku FROM (SELECT sku, SUM(quantity) FROM sales_returns GROUP BY sku ORDER BY 2 DESC LIMIT 3) AS A)
		GROUP BY sku
		ORDER BY 2`, []);


		response.status(200).json({
			daily_sales: daily_sales.rows,
			money_in_stock: money_in_stock,
			top_products: top_products.rows,
			returns: parseInt(returns.rows[0].sum),
			returns_chart: returns_chart.rows, 
		})

	} catch (error) {
		console.error(error);
	}
}


module.exports = {
	dashboardData
}