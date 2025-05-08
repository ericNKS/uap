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
    async findById(id: number): Promise<User> {
        const query = `
            SELECT
                id, name, email, rules
            FROM
                users
            where id = $1
        `;
        try {
            const result = await this.db.query(query, [id]);

            const user = result.rows[0] as User;
            return user;
        } catch (error) {
            throw error
        }
    }
    async remove(id: number): Promise<void> {}
    
    async findAll(): Promise<Array<User>> {
        const query = `
            SELECT
                id, name, email, rules
            FROM
                users
        `;
        try {
            const result = await this.db.query(query);
            return result.rows as User[];
        } catch (error) {
            throw new Error(`Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}