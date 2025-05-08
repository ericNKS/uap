import { FastifyInstance } from "fastify";
import AuthController from "../modules/Auth/Controller/AuthController";

export const ApiControllers = (app: FastifyInstance) => {
    app.post('/api/registrar', AuthController.store)
    app.get('/api/users', AuthController.index)
}