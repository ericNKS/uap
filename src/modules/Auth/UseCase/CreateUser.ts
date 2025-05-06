import CreateUserRequest from "../DTO/CreateUserRequest";
import User from "../Entities/User";
import IRepository from "../Interfaces/IRepository";

export default class CreateUser {
    public constructor(
        private userRepository: IRepository
    ) {}

    public async execute(userRequest: CreateUserRequest): Promise<User> {
        const user = await this.userRepository.save(userRequest)
        return user;
    }
}