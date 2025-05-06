import { Pool } from "pg";

export default class UserRepository {
    constructor(
        private db: Pool
    ) {}
    
    async findByAll(): Promise<any> {
        const result = await this.db.query('SELECT * FROM users')

        return result.rows;
    }
}