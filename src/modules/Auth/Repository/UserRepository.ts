import IUserRepository from "../Interfaces/IUserRepository";
import User from "../Entities/User";
import mysql from 'mysql2/promise';

export default class UserRepository implements IUserRepository {
    constructor(
        private db: mysql.Pool
    ) {}
    
    async createPaciente(user: User): Promise<User> {
        let connection;
        const query = `CALL spregistrarpaciente(?,?,?,?,?,?)`;
    
        try {
            connection = await this.db.getConnection();
            
            await connection.execute(query, [
                user.nomeuser,
                user.emailuser,
                user.senhauser,
                user.teluser,
                user.cpforcnpjuser,
                user.genuser,
            ]);
            
            const [newUsers] = await connection.execute<mysql.RowDataPacket[]>(
                'SELECT iduser FROM users WHERE cpforcnpjuser = ? LIMIT 1',
                [user.cpforcnpjuser]
            );
            
            if (newUsers.length === 0) {
                throw new Error('Erro ao criar o paciente: Usuário não encontrado após inserção');
            }
            
            const idUser = newUsers[0].iduser;
            
            return {...user, idUser} as User;
        } catch (error) {
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }

    async createEspecialista(user: User): Promise<User> {
        let connection;
        const query = `CALL spregistrarespecialista(?,?,?,?,?,?,?,?)`;
    
        try {
            connection = await this.db.getConnection();
            
            await connection.execute(query, [
                user.nomeuser,
                user.emailuser,
                user.senhauser,
                user.teluser,
                user.cpforcnpjuser,
                user.crpuser,
                user.genuser,
                user.rulesuser
            ]);
            
            const [newUsers] = await connection.execute<mysql.RowDataPacket[]>(
                'SELECT iduser FROM users WHERE cpforcnpjuser = ? LIMIT 1',
                [user.cpforcnpjuser]
            );
            
            if (newUsers.length === 0) {
                throw new Error('Erro ao criar o paciente: Usuário não encontrado após inserção');
            }
            
            const idUser = newUsers[0].iduser;
            
            return {...user, idUser} as User;
        } catch (error) {
            throw error;
        } finally {
            if (connection) connection.release();
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