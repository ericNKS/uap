import { Pool } from "pg";
import IRepository from "../Interfaces/IRepository";
import User from "../Entities/User";

export default class UserRepository implements IRepository{
    constructor(
        private db: Pool
    ) {}
    async save(user: User): Promise<User> {
        const query = `
       INSERT INTO users (name, email, password, rules)
       VALUES ($1, $2, $3, $4)
       RETURNING *
    `;
    
    try {
        const result = await this.db.query(query, [
            user.name,
            user.email,
            user.password, // Should be hashed first!
            user.rules || [] // Handle undefined rules
        ]);
        
        return result.rows[0] as User;
    } catch (error) {
        throw error;
    }
    }
    async update(): Promise<User> {return new User()}
    async findByEmail(): Promise<User> {return new User()}
    async findById(): Promise<User> {return new User()}
    async remove(): Promise<void> {}
    
    async findByAll(): Promise<any> {
        const result = await this.db.query('SELECT * FROM users')

        return result.rows;
    }
}