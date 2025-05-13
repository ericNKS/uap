import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config()


export const Database = mysql.createPool({
    host: process.env.DB_HOST || 'database',
    user: process.env.DB_USER || 'app',
    password: process.env.DB_PASSWORD || '!ChangeMe!',
    database: process.env.DB_NAME || 'app',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})