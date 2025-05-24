import {CreateUserRequest} from "../DTO/CreateUserRequest";
import User from "../Entities/User";
import IUserRepository from "../Interfaces/IUserRepository";
import bcrypt from "bcryptjs"
import ExceptionValidation from "../Utils/ExceptionValidation";

export default class CreateUserPaciente {
    public constructor(
        private userRepository: IUserRepository
    ) {}

    public async paciente(userRequest: CreateUserRequest): Promise<User> {
        try {
            const err = await this.validateUser(userRequest)
            if(err != null) {
                throw new ExceptionValidation(err);
            }
            
            const hashedPassword = await bcrypt.hash(userRequest.senhaUser.first, 10)

            const userToSave: User = {
                nomeuser: userRequest.nomeUser,
                emailuser: userRequest.emailUser.toLowerCase(),
                senhauser: hashedPassword,
                teluser: userRequest.telUser || '',
                cpforcnpjuser: userRequest.cpfOrCnpjUser,
                crpuser: userRequest.crpUser || '',
                imgurluser: userRequest.imgurlUser || '',
                genuser: userRequest.genUser,
                rulesuser: userRequest.rulesUser || 'RULE_USER',
                stsativouser: 'n',
            } as User;

            const user = await this.userRepository.createPaciente(userToSave)
            
            return user;
        } catch (error) {
            throw error;
        }
    }

    public async especialista(userRequest: CreateUserRequest): Promise<User> {
        try {
            const err = await this.validateUser(userRequest)
            if(err) {
                throw new Error(err);
            }
            const hashedPassword = await bcrypt.hash(userRequest.senhaUser.first, 10)

            const userToSave: User = {
                nomeuser: userRequest.nomeUser,
                emailuser: userRequest.emailUser.toLowerCase(),
                senhauser: hashedPassword,
                teluser: userRequest.telUser || '',
                cpforcnpjuser: userRequest.cpfOrCnpjUser,
                crpuser: userRequest.crpUser || '',
                imgurluser: userRequest.imgurlUser || '',
                genuser: userRequest.genUser,
                rulesuser: userRequest.rulesUser || 'RULE_ESPECIALISTA',
                stsativouser: 'n',
            } as User;

            const user = await this.userRepository.createEspecialista(userToSave)
            
            return user;
        } catch (error) {
            throw error;
        }
    }

    private async validateUser(user: CreateUserRequest): Promise<string | null> {
        if(user.senhaUser.first !== user.senhaUser.second) {
            return 'password validation is invalid';
        }

        let hasUser = await this.userRepository.findByEmail(user.emailUser);
        if(hasUser) {
            return 'User already exists';
        }

        hasUser = await this.userRepository.findByCpfOrCnpjUser(user.cpfOrCnpjUser);
        if(hasUser) {
            return 'User already exists';
        }

        return null;
    }
}