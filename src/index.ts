import 'reflect-metadata';
import fastify from "fastify";
import multipart from '@fastify/multipart';
import { PrivateRoute, AdminRoute, PublicRoute } from "./routes/Api";
import { Database } from './config/database/Database';
import dotenv from 'dotenv';
import cors from '@fastify/cors';


dotenv.config()

const app = fastify({
    logger: true
});



app.addContentTypeParser('application/json', { parseAs: 'string' }, function (_, body, done) {
    try {
        const json = JSON.parse(body as string)
        done(null, json)
    } catch (err: any) {
        err.statusCode = 400
        done(err, undefined)
    }
})

const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
imageTypes.forEach(type => {
    app.addContentTypeParser(type, function (req, payload, done) {
        done(null, payload);
    });
});

app.register(multipart, {
    limits: {
        fileSize: 1 * 1024 * 1024 // 10MB limit
    }
});
app.register(PrivateRoute);
app.register(AdminRoute);
app.register(PublicRoute);
app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true
})

const start = async () => {

    let connection;
    
    try {
        const dbName = process.env.DB_NAME || 'uap';

        connection = await Database.getConnection();
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);

        if (connection) connection.release();
        await app.listen({ 
            port: 3000,
            host: '0.0.0.0'
        });
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

start()