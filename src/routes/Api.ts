import { FastifyInstance } from "fastify";
import AuthController from "../modules/Auth/Controller/AuthController";
import UserController from "../modules/Auth/Controller/UserController";
import AuthMiddleware from "../config/Middleware/AuthMiddleware";

const handleRule = (rules?: Array<string>): Record<string, any> => {
    let middleware = new AuthMiddleware(rules || []);
    
    return {
        preHandler: middleware.authenticate.bind(middleware)
    };
}

export const PublicRoute = (app: FastifyInstance) => {
    app.post('/api/register', AuthController.register.bind(AuthController));
    app.post('/api/login', AuthController.login.bind(AuthController));
}

export const PrivateRoute = (app: FastifyInstance) => {
    app.get('/api/user', handleRule(), UserController.show.bind(AuthController));
    app.delete('/api/users', handleRule(), UserController.deleteSelf.bind(AuthController));
}

export const AdminRoute = (app: FastifyInstance) => {
    const rule = ['RULE_ADMIN'];
    app.get('/api/users', handleRule(rule), UserController.index.bind(AuthController));
    app.delete('/api/users/:id', handleRule(rule), UserController.delete.bind(AuthController));
}