import {CreateUserRequest} from "../DTO/CreateUserRequest";
import User from "../Entities/User";
import IUserRepository from "../Interfaces/IUserRepository";
import bcrypt from "bcrypt"

export default class CreateUser {
    public constructor(
        private userRepository: IUserRepository
    ) {}

    public async execute(userRequest: CreateUserRequest): Promise<User> {
        this.validateUser(userRequest)
        const hashedPassword = await bcrypt.hash(userRequest.senhaUser.first, 10)

        const userToSave: User = {
            nomeuser: userRequest.nomeUser,
            emailuser: userRequest.emailUser,
            senhauser: hashedPassword,
            teluser: userRequest.telUser || '',
            cpforcnpjuser: userRequest.cpfOrCnpjUser,
            crpuser: userRequest.crpUser || '',
            imgurluser: userRequest.imgurlUser || '',
            genuser: userRequest.genUser,
            rulesuser: userRequest.rulesUser || 'RULE_USER',
            stsativouser: userRequest.stsativoUser || 'n',
        } as User;

        const user = await this.userRepository.save(userToSave)
        return user;
    }

    private validateUser(user: CreateUserRequest) {
        if(user.senhaUser.first !== user.senhaUser.second) {
            throw new Error('password validation is invalid')
        }
    }
}