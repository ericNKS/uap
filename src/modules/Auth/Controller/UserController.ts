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
import User from "../Entities/User";
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
        const deleteUserService = new DeleteUser(userRepo);

        try {
            await deleteUserService.execute(userToken.idUser);

            return reply.code(204).send();
        } catch (error) {
            if (error instanceof ExceptionNotFound) {
                return reply.code(404).send(error);
            }
            return reply.code(500).send(error);
        }
    }

    static async update(
        req: FastifyRequest,
        reply: FastifyReply,
    ) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
    
            if(!token) {
                return reply.code(401).send({
                    error: 'Authentication required'
                });
            }
    
            const userToken = JwtToken.decode(token);
            
            // Check if we have a valid user ID from the token
            if (!userToken || !userToken.idUser) {
                return reply.code(401).send({
                    error: 'Invalid authentication token'
                });
            }
    
            // Handle multipart form data
            let userData: UpdateUserDTO;
            
            // Check if the request is multipart
            const contentType = req.headers['content-type'] || '';
            if (contentType.includes('multipart/form-data')) {
                // For multipart requests, we need to parse the form fields manually
                const formData: any = {};
                
                // Parse form fields from the request
                const parts = req.parts();
                
                for await (const part of parts) {
                    if (part.type === 'file' && part.fieldname === 'imgurluser') {
                        // Handle file upload
                        const uploadImage = new UploadImage(uploadDir);
                        formData.imgurluser = await uploadImage.execute(part);
                    } else if (part.type === 'field') {
                        // Handle regular form fields
                        formData[part.fieldname] = part.value;
                    }
                }
                
                // Convert form data to DTO
                userData = plainToInstance(UpdateUserDTO, formData);
            } else {
                // For JSON requests
                userData = plainToInstance(UpdateUserDTO, req.body);
            }
            
            // Ensure userData is not undefined before validation
            if (!userData) {
                return reply.code(400).send({
                    error: 'No update data provided'
                });
            }
            
            // Validate the data
            const validationsErr = await validate(userData);
            const err = FormExceptions(validationsErr);
            
            if(err) {
                return reply.code(400).send({ err });
            }
            
            // Update the user
            const userRepository = new UserRepository(Database);
            const updateUserService = new UpdateUser(userRepository);
    
            const user = await updateUserService.execute(userToken.idUser, userData);
            
            return reply.send({
                success: true,
                user
            });
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