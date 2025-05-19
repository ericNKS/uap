import User from "../Entities/User";
import UserRepository from "../Repository/UserRepository";

export default class UpdateUser {
    constructor(
        private userRepository: UserRepository
    ) {}

    public async execute(user: User): Promise<User> {
        return user;
    }
}