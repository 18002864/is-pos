const { Pool, Client } = require('pg')
const axios = require('axios')

const pool = new Pool({
	user: 'postgres',
	host: 'is-pos.cpuskbampv3u.us-east-2.rds.amazonaws.com',
	database: 'pos',
	password: 'manchasymima',
	port: 5432,
})

const getProducts = async (request, response) => {
	try {
		id_bodega = request.params.id_bodega;
		let resultbodegas = await pool.query(`select *
        from bodegas
			where id_bodega = $1`, [id_bodega]);
			
		let bodegas = resultbodegas.rows[0];
		let endpoint = "bodega/";

		/*
		let jwt = await axios({
			method: 'post',
			url: 'https://auth.zer0th.com/api/node/user/auth',
			data: {
				"username": "serviceaccount",
				"password": "P@ssw0rdS3c4r3"
			}
		});
		*/
		var infoProductos = await axios.get(bodegas.base_url+endpoint+id_bodega,{
			/*headers: {
				"Authorization":jwt.data.data.token
			}
			*/
		});
		if (infoProductos.status == 200) {
			response.status(200).json(infoProductos.data);
		} else {
			response.status(200).json({"status":"error", response})
		}
	} catch (error) {
		console.error(error);
	}
}

const getAllProducts = async (request, response) => {
	try {
		id_bodega = request.params.id_bodega;
		let resultbodegas = await pool.query(`select *
        from bodegas
			where id_bodega = $1`, [id_bodega]);
			
		let bodegas = resultbodegas.rows[0];
		
		var infoProductos = await axios.get(bodegas.base_url + "products/");
		if (infoProductos.status == 200) {
			response.status(200).json(infoProductos.data);
		} else {
			response.status(200).json({"status":"error", response})
		}
	} catch (error) {
		console.error(error);
	}
}

const getAllBodegas = async (request, response) => {
	try {
		id_bodega = request.params.id_bodega;
		let resultbodegas = await pool.query(`select *
        from bodegas
			where id_bodega = $1`, [id_bodega]);
			
		let bodegas = resultbodegas.rows[0];
		var infoProductos = await axios.get(bodegas.base_url + "bodega/");
		if (infoProductos.status == 200) {
			response.status(200).json(infoProductos.data);
		} else {
			response.status(200).json({"status":"error", response})
		}
	} catch (error) {
		console.error(error);
	}
}

const getProductById = async (request, response) => {
	try {
		let id_bodega = request.params.id_bodega;
		let id = request.params.id;

		let resultbodegas = await pool.query(`select *
        from bodegas
			where id_bodega = $1`, [id_bodega]);
			
		let bodegas = resultbodegas.rows[0];

		var infoProductos = await axios.get(bodegas.base_url + 'products/' + id,{});
		if (infoProductos.status == 200) {
			response.status(200).json(infoProductos.data);
		} else {
			response.status(200).json({"status":"error", response})
		}
	} catch (error) {
		console.error(error);
	}
}

module.exports = {
	getProducts,
	getAllProducts,
	getAllBodegas,
	getProductById
}