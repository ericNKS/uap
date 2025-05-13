import { FastifyInstance } from "fastify";
import AuthController from "../modules/Auth/Controller/AuthController";

export const ApiControllers = (app: FastifyInstance) => {
    app.post('/api/register/p', AuthController.store.bind(AuthController));
    app.get('/api/users', AuthController.index.bind(AuthController));
    app.get('/api/users/:id', AuthController.show.bind(AuthController));
    app.delete('/api/users/:id', AuthController.delete.bind(AuthController));

}