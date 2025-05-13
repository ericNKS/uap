import { Pool } from "pg";
import IRepository from "../Interfaces/IRepository";
import User from "../Entities/User";

export default class UserRepository implements IRepository{
    constructor(
        private db: Pool
    ) {}
    async save(user: User): Promise<User> {
        const query = `
            INSERT INTO users (
                nomeuser, emailuser, senhauser,
                teluser, cpforcnpjuser, crpuser,
                imgurluser, genuser, rulesuser, stsativouser
            )
            VALUES
            (
                $1, $2, $3,
                $4, $5, $6,
                $7, $8, $9, $10
            )
            RETURNING *
        `;
    
    try {
        const result = await this.db.query(query, [
            user.nomeuser,
            user.emailuser,
            user.senhauser,
            user.teluser,
            user.cpforcnpjuser,
            user.crpuser,
            user.imgurluser,
            user.genuser,
            user.rulesuser,
            user.stsativouser,
        ]);
        
        return result.rows[0] as User;
    } catch (error) {
        throw error;
    }
    }
    async update(): Promise<User> {return new User()}
    async findByEmail(email: string): Promise<User> {
        const query = `
            SELECT
                nomeuser, emailuser, senhauser,
                teluser, cpforcnpjuser, crpuser,
                imgurluser, genuser, rulesuser, stsativouser
            FROM
                users
            where emailuser = $1
        `;
        try {
            const result = await this.db.query(query, [email]);

            const user = result.rows[0] as User;
            return user;
        } catch (error) {
            throw error
        }
    }
    async findById(id: number): Promise<User> {
        const query = `
            SELECT
                nomeuser, emailuser, senhauser,
                teluser, cpforcnpjuser, crpuser,
                imgurluser, genuser, rulesuser, stsativouser
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
                nomeuser, emailuser, senhauser,
                teluser, cpforcnpjuser, crpuser,
                imgurluser, genuser, rulesuser, stsativouser
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