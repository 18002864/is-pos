const { Pool, Client } = require('pg')
const axios = require('axios')
const pool = new Pool({
	user: 'postgres',
	host: 'is-pos.cpuskbampv3u.us-east-2.rds.amazonaws.com',
	database: 'pos',
	password: 'manchasymima',
	port: 5432,
})



const getJWTService = async (request, response) => {
	try {

		let jwt = await axios({
			method: 'post',
			url: 'https://auth.zer0th.com/api/node/user/auth',
			data: {
				"username": "serviceaccount",
				"password": "P@ssw0rdS3c4r3"
			}
		});
		response.status(200).json(jwt.data);
	} catch (error) {
		console.log(error);
	}
}

module.exports = {
	getJWTService
}