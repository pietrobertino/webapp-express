const mysql2 = require('mysql2');

const connection = mysql2.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'db_movies'
});

connection.connect((err) => {
    if (err) throw err
    console.log('Connected to mysql');
});

module.exports = connection;