import 'reflect-metadata';
import fastify from "fastify";
import multipart from '@fastify/multipart';
import { PrivateRoute, AdminRoute, PublicRoute } from "./routes/Api";

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