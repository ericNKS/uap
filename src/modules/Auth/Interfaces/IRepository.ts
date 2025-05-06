import User from "../Entities/User";

export default interface IRepository {
    save: () => User,
    update: () => User,
    findByEmail: () => User,
    findById: () => User
    remove: () => void,
}