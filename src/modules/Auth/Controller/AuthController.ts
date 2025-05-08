import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserRequest } from "../DTO/CreateUserRequest";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import CreateUser from "../UseCase/CreateUser";
import UserRepository from "../Repository/UserRepository";
import { Postgres } from "../../../config/database/Postgres";
import FormExceptions from "../../../utils/FormExceptions";

export default class AuthController {
    static async index(
        req: FastifyRequest,
        reply: FastifyReply,
    ) {
        const userRepository = new UserRepository(Postgres);
        const users = await userRepository.findAll();

        return reply.send(users)
    }
    static async store(
        req: FastifyRequest,
        reply: FastifyReply,
    ) {
        const userData = plainToInstance(CreateUserRequest, req.body);
        const validationsErr = await validate(userData);
        const err = FormExceptions(validationsErr);

        if(err) {
            return reply.code(400).send({ err });
        }

        const userRepository = new UserRepository(Postgres);

        const createUserService = new CreateUser(userRepository);

        const user = createUserService.execute(userData);
        return reply.code(201).send(user);
    }

    static async show(
        req: FastifyRequest<{Params: {id: number}}>,
        reply: FastifyReply,
    ) {
        const {id} = req.params;

        const userRepo = new UserRepository(Postgres);
        const user = await userRepo.findById(id);

        return reply.send(user);
    }

    static async delete(
        req: FastifyRequest<{Params: {id: number}}>,
        reply: FastifyReply,
    ) {
        const {id} = req.params;

        const userRepo = new UserRepository(Postgres)
        const user = await userRepo.findById(id)

        if(!user) {
            return reply.code(404).send({
                error: 'user not found'
            })
        }

        await userRepo.remove(id)

        return reply.code(204).send();
    }
    
}