import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import AuthController from "../modules/Auth/Controller/AuthController";
import UserController from "../modules/Auth/Controller/UserController";
import AuthMiddleware from "../config/Middleware/AuthMiddleware";
import ImageController from "../modules/File/Controller/ImageController";
import OfficeHoursController from "../modules/Consulta/Controller/OfficeHoursController";
import ConsultaController from "../modules/Consulta/Controller/ConsultasController";

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

    // Office Hours
    app.get('/api/expedientes/:especialista', handleRule(), OfficeHoursController.list.bind(OfficeHoursController));

    // Consultas
    app.post('/api/consultas', handleRule(), ConsultaController.store.bind(ConsultaController));
    app.post('/api/consultas/:id/ativar', handleRule(), ConsultaController.active.bind(ConsultaController));
    app.post('/api/consultas/:id/desativar', handleRule(), ConsultaController.disable.bind(ConsultaController));
    app.get('/api/consultas/confirmadas', handleRule(), ConsultaController.listConfirmed.bind(ConsultaController));
}

export const EspecialistaRoute = (app:FastifyInstance) => {
    // Office Hours
    const rule = ['RULE_ADMIN', 'RULE_ESPECIALISTA_ATIVO'];

    app.post('/api/expedientes', handleRule(rule), OfficeHoursController.store.bind(OfficeHoursController));
    app.patch('/api/expedientes/:id', handleRule(rule), OfficeHoursController.changeStatusOfficeHours.bind(OfficeHoursController));

    app.delete('/api/expedientes/:id', handleRule(rule), OfficeHoursController.delete.bind(OfficeHoursController));

    app.get('/api/consultas/nao-confirmadas', handleRule(rule), ConsultaController.listNotConfirmed.bind(ConsultaController));
}

export const AdminRoute = (app: FastifyInstance) => {
    const rule = ['RULE_ADMIN'];
    app.get('/api/users', handleRule(rule), UserController.index.bind(AuthController));
    app.delete('/api/users/:id', handleRule(rule), UserController.delete.bind(AuthController));
}