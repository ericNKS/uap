import { FastifyInstance } from "fastify";
import AuthController from "../modules/Auth/Controller/AuthController";
import UserController from "../modules/Auth/Controller/UserController";

export const ApiControllers = (app: FastifyInstance) => {
    app.post('/api/register', AuthController.register.bind(AuthController));
    app.post('/api/login', AuthController.login.bind(AuthController));
    app.get('/api/users', UserController.index.bind(AuthController));
    app.get('/api/user', UserController.show.bind(AuthController));
    app.delete('/api/users/:id', UserController.delete.bind(AuthController));

}