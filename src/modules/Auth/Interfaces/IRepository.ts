import User from "../Entities/User";

export default interface IRepository {
    save: (user: User) => Promise<User>,
    update: (user: User) => Promise<User>,
    findByEmail: (email: string) => Promise<User>,
    findById: (id: number) => Promise<User>,
    remove: (id: number) => Promise<void>,
}