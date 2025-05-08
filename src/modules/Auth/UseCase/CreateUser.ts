import {CreateUserRequest} from "../DTO/CreateUserRequest";
import User from "../Entities/User";
import IRepository from "../Interfaces/IRepository";

export default class CreateUser {
    public constructor(
        private userRepository: IRepository
    ) {}

    public async execute(userRequest: CreateUserRequest): Promise<User> {
        const userToSave = new User(
            userRequest.name,
            userRequest.email,
            userRequest.password.first,
            userRequest.rules ?? ['RULE_USER']
        );
        
        const user = await this.userRepository.save(userToSave)
        return user;
    }
}