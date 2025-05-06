import CreateUserRequest from "../DTO/CreateUserRequest";
import User from "../Entities/User";

export default interface IRepository {
    save: (user: CreateUserRequest) => Promise<User>,
    update: () => Promise<User>,
    findByEmail: () => Promise<User>,
    findById: () => Promise<User>,
    remove: () => Promise<void>,
}