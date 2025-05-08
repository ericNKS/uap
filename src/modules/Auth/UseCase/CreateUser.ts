import {CreateUserRequest} from "../DTO/CreateUserRequest";
import User from "../Entities/User";
import IRepository from "../Interfaces/IRepository";
import bycrypt from 'bcrypt'

export default class CreateUser {
    public constructor(
        private userRepository: IRepository
    ) {}

    public async execute(userRequest: CreateUserRequest): Promise<User> {
        this.validateUser(userRequest)
        
        const hashedPassword = await bycrypt.hash(userRequest.password.first, 100)

        const userToSave = new User(
            userRequest.name,
            userRequest.email,
            hashedPassword,
            userRequest.rules ?? ['RULE_USER']
        );

        const user = await this.userRepository.save(userToSave)
        return user;
    }

    private validateUser(user: CreateUserRequest) {
        if(user.password.first !== user.password.second) {
            throw new Error('password validation is invalid')
        }
    }
}