import { FastifyReply, FastifyRequest } from "fastify";
import UserRepository from "../Repository/UserRepository";
import { Database } from "../../../config/database/Database";
import UserResponse from "../DTO/UserResponse";
import JwtToken from "../UseCase/JwtToken";

export default class UserController {
    static async index(
        req: FastifyRequest,
        reply: FastifyReply,
    ) {
        const userRepository = new UserRepository(Database);
        const users = await userRepository.findAll();

        return reply.send(users)
    }

    static async show(
        req: FastifyRequest,
        reply: FastifyReply,
    ) {
        const token = req.headers.authorization?.split(' ')[1];

        if(!token) {
            return reply.code(404).send({
                error: 'user not exists'
            });
        }

        const userToken = JwtToken.decode(token)

        if(!userToken.idUser) {
            return reply.code(404).send({
                error: 'user not exists'
            });
        }

        const userRepo = new UserRepository(Database);
        const user = await userRepo.findById(userToken.idUser);

        return reply.send(user);
    }

    static async delete(
        req: FastifyRequest<{Params: {id: number}}>,
        reply: FastifyReply,
    ) {
        const {id} = req.params;

        const userRepo = new UserRepository(Database)
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