import 'reflect-metadata';
import fastify from "fastify";
import { ApiControllers } from "./routes/Api";

const app = fastify({
    logger: true
})

// Add a body parser for JSON content-type
app.addContentTypeParser('application/json', { parseAs: 'string' }, function (_, body, done) {
    try {
        const json = JSON.parse(body as string)
        done(null, json)
    } catch (err: any) {
        err.statusCode = 400
        done(err, undefined)
    }
})

app.register(ApiControllers)

const start = async () => {
    try {
        await app.listen({ 
            port: 3000,
            host: '0.0.0.0' // Listen on all available network interfaces
        })
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

start()