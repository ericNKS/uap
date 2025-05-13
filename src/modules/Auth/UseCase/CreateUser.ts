import {CreateUserRequest} from "../DTO/CreateUserRequest";
import User from "../Entities/User";
import IUserRepository from "../Interfaces/IUserRepository";
import bcrypt from "bcryptjs"

export default class CreateUserPaciente {
    public constructor(
        private userRepository: IUserRepository
    ) {}

    public async paciente(userRequest: CreateUserRequest): Promise<User | void> {
        try {
            this.validateUser(userRequest)
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
            console.error('Erro durante a criação do usuário:', error);
            throw error;
        }
    }

    public async especialista(userRequest: CreateUserRequest): Promise<User | void> {
        try {
            this.validateUser(userRequest)
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
            console.error('Erro durante a criação do usuário:', error);
            throw error;
        }
    }

    private validateUser(user: CreateUserRequest) {
        if(user.senhaUser.first !== user.senhaUser.second) {
            throw new Error('password validation is invalid')
        }
    }
}