import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserRequest } from "../DTO/CreateUserRequest";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import CreateUser from "../UseCase/CreateUser";
import UserRepository from "../Repository/UserRepository";
import { Postgres } from "../../../config/database/Postgres";

export default class AuthController {
    static async store(
        req: FastifyRequest,
        reply: FastifyReply,
    ) {
        const userData = plainToInstance(CreateUserRequest, req.body);
        const errors = await validate(userData);

        if (errors.length > 0) {
            return reply.code(400).send({ errors });
        }

        const userRepository = new UserRepository(Postgres)

        const createUserService = new CreateUser(userRepository)

        const user = createUserService.execute(userData)
        return user
    }
}