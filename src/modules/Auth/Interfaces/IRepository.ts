import User from "../Entities/User";

export default interface IRepository {
    save: (user: User) => Promise<User>,
    update: () => Promise<User>,
    findByEmail: () => Promise<User>,
    findById: () => Promise<User>,
    remove: () => Promise<void>,
}