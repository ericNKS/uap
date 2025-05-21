import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserRequest } from "../DTO/CreateUserRequest";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import CreateUserPaciente from "../UseCase/CreateUser";
import UserRepository from "../Repository/UserRepository";
import { Database } from "../../../config/database/Database";
import FormExceptions from "../../../utils/FormExceptions";
import User from "../Entities/User";
import JwtToken from "../UseCase/JwtToken";
import ExceptionValidation from "../Utils/ExceptionValidation";
import UserResponse from "../DTO/UserResponse";
import { LoginDTO } from "../DTO/LoginDTO";
import LoginUser from "../UseCase/LoginUser";
import ExceptionNotFound from "../Utils/ExceptionNotFound";
import RevokeToken from "../UseCase/RevokeToken";
import RedisService from "../../../config/database/RedisService";
import GenerateAccountActivationToken from "../UseCase/GenerateAccountActivationToken";
import ActiveAccount from "../UseCase/ActiveAccount";

export default class AuthController {
    static async register(
        req: FastifyRequest,
        reply: FastifyReply,
    ) {
        try {
            const userData = plainToInstance(CreateUserRequest, req.body);
            const validationsErr = await validate(userData);
            const err = FormExceptions(validationsErr);
            
            if(err) {
                return reply.code(400).send({ err });
            }
            
            const userRepository = new UserRepository(Database);
            
            const createUserService = new CreateUserPaciente(userRepository);
            
            let user: User;
            switch (userData.userType) {
                case 'especialista':
                    user = await createUserService.especialista(userData);
                    break;
                default:
                    user = await createUserService.paciente(userData);
                    break;
            }

            const generateAccountActivationToken = new GenerateAccountActivationToken(RedisService.getInstance());
            await generateAccountActivationToken.execute(user);

            
            return reply.code(201).send({
                success: 'Foi enviado um email para verificar a conta'
            });
            
        } catch (error) {
            if(error instanceof ExceptionValidation) {
                return reply.code(400).send({
                    error: error.message
                });
            }

            return reply.code(500).send({error});
        }
    }

    static async login(
        req: FastifyRequest,
        reply: FastifyReply,
    ) {
        try {
            const userData = plainToInstance(LoginDTO, req.body);
            const validationsErr = await validate(userData);
            const err = FormExceptions(validationsErr);
            
            if(err) {
                return reply.code(400).send({ err });
            }

            const repo = new UserRepository(Database);
            const loginService = new LoginUser(repo)

            const generatedToken = await loginService.execute(userData);
            
            return reply.code(200).send({
                token: generatedToken
            });
            
        } catch (error) {
            if(error instanceof ExceptionValidation) {
                return reply.code(400).send({
                    error: error.message
                });
            }
            
            if(error instanceof ExceptionNotFound) {
                return reply.code(404).send({
                    error: error.message
                });
            }
            

            return reply.code(500).send(error);
        }
    }

    static async logout(
        req: FastifyRequest,
        reply: FastifyReply,
    ) {
        const token = req.headers.authorization?.split(' ')[1];
        if(!token) return reply.code(401).send({
            error: 'Usuario não esta autenticado'
        });
        const redis = RedisService.getInstance();
        const revokeToken = new RevokeToken(redis)
        
        try {
            await revokeToken.execute(token)
            return reply.code(204).send();
        } catch (error) {
            return reply.code(500).send(error);
        }
    }


    static async verifyEmail(
        req: FastifyRequest<{Params: {token: string}}>,
        reply: FastifyReply
    ) {
        const emailToken = req.params.token;
        const redisName = `user:tokenActivation:${emailToken}`;
        const redis = RedisService.getInstance();

        const userToken = await redis.get(redisName);

        if(!userToken) {
            return reply.code(404).send({
                error: 'Token invalid'
            });
        }

        const repository = new UserRepository(Database);
        const activeAccountService = new ActiveAccount(repository);
        
        const idUser = JSON.parse(userToken).idUser;
        await activeAccountService.execute(idUser);

        redis.remove(redisName);

        return reply.code(204).send();
    }
    
}