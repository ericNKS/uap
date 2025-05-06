import {Pool} from 'pg';
import dotenv from 'dotenv';

dotenv.config()

export const Postgres = new Pool({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
})