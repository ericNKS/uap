import { FastifyReply, FastifyRequest } from "fastify";
import UserRepository from "../Repository/UserRepository";
import { Database } from "../../../config/database/Database";
import JwtToken from "../UseCase/JwtToken";
import DeleteUser from "../UseCase/DeleteUser";
import ExceptionNotFound from "../Utils/ExceptionNotFound";
import UploadImage from "../../File/UseCase/UploadImage";
import { uploadDir } from "../../../utils/UploadDir";
import { plainToInstance } from "class-transformer";
import UpdateUserDTO from "../DTO/UpdateUserDTO";
import { validate } from "class-validator";
import FormExceptions from "../../../utils/FormExceptions";
import UpdateUser from "../UseCase/UpdateUser";

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

    static async deleteSelf(
        req: FastifyRequest,
        reply: FastifyReply,
    ) {
        const userRepo = new UserRepository(Database);
        const deleteUserService = new DeleteUser(userRepo);

        try {
            await deleteUserService.execute(req.user.IdUser);

            return reply.code(204).send();
        } catch (error) {
            if (error instanceof ExceptionNotFound) {
                return reply.code(404).send(error);
            }
            return reply.code(500).send(error);
        }
    }

    static async update(req: FastifyRequest, reply: FastifyReply) {
        try {
            const headersUser = req.user;
    
            let userData: UpdateUserDTO;
            const contentType = req.headers['content-type'] || '';
    
            if (contentType.includes('multipart/form-data')) {
                const formData: any = {};
                const parts = req.parts();
    
                for await (const part of parts) {
                    if (part.type === 'file' && part.fieldname === 'imgurluser') {
                        const uploadImage = new UploadImage(uploadDir);
                        formData.imgurluser = await uploadImage.execute(part);
                    } else if (part.type === 'field') {
                        formData[part.fieldname] = part.value;
                    }
                }
    
                userData = plainToInstance(UpdateUserDTO, formData);
            } else {
                userData = plainToInstance(UpdateUserDTO, req.body);
            }
    
            if (!userData) {
                return reply.code(400).send({ error: 'No update data provided' });
            }
    
            const validationsErr = await validate(userData);
            const err = FormExceptions(validationsErr);
            if (err) {
                return reply.code(400).send({ err });
            }
    
            const userRepository = new UserRepository(Database);
            const updateUserService = new UpdateUser(userRepository);
            const user = await updateUserService.execute(headersUser.idUser, userData);
    
            return reply.send(user);
        } catch (error) {
            req.log.error(error);
            return reply.code(500).send({
                error: 'Failed to update user',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    static async delete(
        req: FastifyRequest<{Params: {id: number}}>,
        reply: FastifyReply,
    ) {
        const {id} = req.params;

        const userRepo = new UserRepository(Database)
        const deleteUserService = new DeleteUser(userRepo);

        try {
            await deleteUserService.execute(id);

            return reply.code(204).send();
        } catch (error) {
            if (error instanceof ExceptionNotFound) {
                return reply.code(404).send(error);
            }
            return reply.code(500).send(error);
        }
    }

}