import User from "../Entities/User";
import IRepository from "../Interfaces/IRepository";

export default class CreateUser {
    public constructor(
        private IRepository: IRepository
    ) {}

    public async execute(): Promise<User> {
        const user = new User();
        return user;
    }
}