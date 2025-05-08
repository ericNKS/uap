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
        
        this.validateUser(userRequest)

        const user = await this.userRepository.save(userToSave)
        return user;
    }

    private validateUser(user: CreateUserRequest) {
        if(user.password.first !== user.password.second) {
            throw new Error('password validation is invalid')
        }
    }
}