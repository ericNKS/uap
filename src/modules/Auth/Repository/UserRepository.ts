import { Pool } from "pg";
import IRepository from "../Interfaces/IRepository";
import User from "../Entities/User";

export default class UserRepository implements IRepository{
    constructor(
        private db: Pool
    ) {}
    async save(): Promise<User> {return new User()}
    async update(): Promise<User> {return new User()}
    async findByEmail(): Promise<User> {return new User()}
    async findById(): Promise<User> {return new User()}
    async remove(): Promise<void> {}
    
    async findByAll(): Promise<any> {
        const result = await this.db.query('SELECT * FROM users')

        return result.rows;
    }
}