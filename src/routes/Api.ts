import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import AuthController from "../modules/Auth/Controller/AuthController";
import UserController from "../modules/Auth/Controller/UserController";
import AuthMiddleware from "../config/Middleware/AuthMiddleware";
import ImageController from "../modules/File/Controller/ImageController";

const handleRule = (rules?: Array<string>): Record<string, any> => {
    let middleware = new AuthMiddleware(rules || []);
    
    return {
        preHandler: middleware.authenticate.bind(middleware)
    };
}

export const PublicRoute = (app: FastifyInstance) => {
    app.post('/api/register', AuthController.register.bind(AuthController));
    app.post('/api/login', AuthController.login.bind(AuthController));
    app.get('/api/active/:token', AuthController.validateEmail.bind(AuthController));
    
    app.get('/api/image/:filename', ImageController.show.bind(ImageController));
}

export const PrivateRoute = (app: FastifyInstance) => {
    app.post('/api/logout', handleRule(), AuthController.logout.bind(AuthController));
    app.get('/api/user', handleRule(), UserController.show.bind(AuthController));
    app.delete('/api/users', handleRule(), UserController.deleteSelf.bind(AuthController));
    app.patch('/api/users', handleRule(), UserController.update.bind(UserController));
    app.patch('/api/users/image', handleRule(), UserController.updateImage.bind(UserController));
    app.patch('/api/users/password', handleRule(), UserController.updatePassword.bind(UserController));
}

export const AdminRoute = (app: FastifyInstance) => {
    const rule = ['RULE_ADMIN'];
    app.get('/api/users', handleRule(rule), UserController.index.bind(AuthController));
    app.delete('/api/users/:id', handleRule(rule), UserController.delete.bind(AuthController));
}