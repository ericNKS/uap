import 'reflect-metadata';
import fastify from "fastify";
import { PrivateRoute, AdminRoute, PublicRoute } from "./routes/Api";

const app = fastify({
    logger: true
})

app.addContentTypeParser('application/json', { parseAs: 'string' }, function (_, body, done) {
    try {
        const json = JSON.parse(body as string)
        done(null, json)
    } catch (err: any) {
        err.statusCode = 400
        done(err, undefined)
    }
})

app.register(PrivateRoute);
app.register(AdminRoute);
app.register(PublicRoute);

const start = async () => {
    try {
        await app.listen({ 
            port: 3000,
            host: '0.0.0.0'
        })
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

start()