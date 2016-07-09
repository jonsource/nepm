// config/database.js
module.exports = {
    connection: {
    	connectionLimit : 100,
        host: '172.17.0.2',
        port: 3306,
        user: 'root',
        password: '1234',
        database: 'test',
    },
	users_table: 'client'
};
