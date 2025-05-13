import IUserRepository from "../Interfaces/IUserRepository";
import User from "../Entities/User";
import mysql from 'mysql2/promise';

export default class UserRepository implements IUserRepository {
    constructor(
        private db: mysql.Pool
    ) {}
    
    async save(user: User): Promise<User> {
        const query = `
            INSERT INTO users (
                nomeuser, emailuser, senhauser,
                teluser, cpforcnpjuser, crpuser,
                imgurluser, genuser, rulesuser, stsativouser
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
    
        try {
            const [result] = await this.db.query(query, [
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
            
            const idUser = (result as mysql.ResultSetHeader).insertId;
            return {...user, idUser} as User;
        } catch (error) {
            throw error;
        }
    }
    
    async update(): Promise<User> {return new User()}
    
    async findByEmail(email: string): Promise<User> {
        const query = `
            SELECT *
            FROM users
            WHERE emailuser = ?
        `;
        try {
            const [rows] = await this.db.query(query, [email]);
            const users = rows as User[];
            return users[0];
        } catch (error) {
            throw error;
        }
    }
    
    async findById(id: number): Promise<User> {
        const query = `
            SELECT *
            FROM users
            WHERE id = ?
        `;
        try {
            const [rows] = await this.db.query(query, [id]);
            const users = rows as User[];
            return users[0];
        } catch (error) {
            throw error;
        }
    }
    
    async remove(id: number): Promise<void> {}
    
    async findAll(): Promise<Array<User>> {
        const query = `
            SELECT *
            FROM users
        `;
        try {
            const [rows] = await this.db.query(query);
            return rows as User[];
        } catch (error) {
            throw new Error(`Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}