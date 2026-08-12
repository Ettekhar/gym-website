const mysql = require('mysql2')
const dotenv = require('dotenv')
dotenv.config();


const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
    waitForConnections: true,
    ssl: process.env.MYSQL_SSL === 'true' ? { rejectUnauthorized: false } : false
}).promise();


const testConnection = async() => {
    try {
        const connection = await pool.getConnection();
        console.log('Database Connected');
        connection.release();
    } catch (err) {
        console.error('Error connecting Database:',err.stack);
    }
}

testConnection();

module.exports = pool