import IUserRepository from "../Interfaces/IUserRepository";
import User from "../Entities/User";
import mysql from 'mysql2/promise';
import ExceptionNotFound from "../Utils/ExceptionNotFound";

export default class UserRepository implements IUserRepository {
    constructor(
        private db: mysql.Pool
    ) {}
    
    async createPaciente(user: User): Promise<User> {
        let connection;
        const query = `CALL spregistrarpaciente(?,?,?,?,?,?,?)`;
    
        try {
            connection = await this.db.getConnection();
            
            await connection.execute(query, [
                user.NomeUser,
                user.EmailUser,
                user.SenhaUser,
                user.TelUser,
                user.CpfOrCnpjUser,
                user.GenUser,
                user.PronomeUser,
            ]);
            
            const [newUsers] = await connection.execute<mysql.RowDataPacket[]>(
                'CALL spPegarUserCpfOrCnpj(?)',
                [user.CpfOrCnpjUser]
            );
            
            if (newUsers.length === 0) {
                throw new Error('Erro ao criar o paciente: Usuário não encontrado após inserção');
            }
            
            const idUser = newUsers[0][0].IdUser;
            
            const userWithId = {...user, IdUser: idUser};
            return User.get(userWithId);
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
                user.NomeUser,
                user.EmailUser,
                user.SenhaUser,
                user.TelUser,
                user.CpfOrCnpjUser,
                user.CrpUser,
                user.GenUser,
                user.RulesUser
            ]);
            
            const [newUsers] = await connection.execute<mysql.RowDataPacket[]>(
                'SELECT iduser FROM users WHERE cpforcnpjuser = ? LIMIT 1',
                [user.CpfOrCnpjUser]
            );
            
            if (newUsers.length === 0) {
                throw new Error('Erro ao criar o paciente: Usuário não encontrado após inserção');
            }
            
            const idUser = newUsers[0].iduser;
            
            return {...user, IdUser: idUser} as User;
        } catch (error) {
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }
    async activeByEmail(user: User): Promise<User> {
        const selectQuery = `
            CALL spAtivarEmail(?)
        `;

        try {
            await this.db.query(selectQuery, [user.EmailUser]);
            user.StsVerificarEmail = true;
            return user;
        } catch (error) {
            throw error;
        }
    }
    
    async update(user: User): Promise<User> {
        if(!user.IdUser) throw new Error('User sem id');
        const updateWithouPasswordQuery = `
            UPDATE
                users u
            SET
                u.NomeUser = ?,
                u.TelUser = ?,
                u.GenUser = ?,
                u.PronomeUser = ?
            WHERE
                u.IdUser = ?;
        `;

        try {
            let updateQuery = updateWithouPasswordQuery;
            let values = [
                user.NomeUser,
                user.TelUser,
                user.GenUser,
                user.PronomeUser,
                user.IdUser,
            ];

            await this.db.query(updateQuery, values);
            
            const userSaved = await this.findById(user.IdUser);
            return userSaved;

        } catch (error) {
            throw error;
        }
    }

    async updatePassword(user: User): Promise<User> {
        if(!user.IdUser) throw new Error('Usuario sem id');
        const updateQuery = `
            UPDATE
                users u
            SET
                u.SenhaUser = ?
            WHERE
                u.IdUser = ?;
        `;

        try {
            let values = [
                user.SenhaUser,
                user.IdUser,
            ];

            await this.db.query(updateQuery, values);

            const userSaved = await this.findById(user.IdUser);
            return userSaved;

        } catch (error) {
            throw error;
        }
    }

    async updateImage(user: User): Promise<User> {
        if(!user.IdUser) throw new Error('Usuario sem id');
        const updateQuery = `
            CALL spAdicionarImgUsuario(?, ?)
        `;

        try {
            let values = [
                user.IdUser,
                user.ImgUrlUser,
            ];

            await this.db.query(updateQuery, values);

            const userSaved = await this.findById(user.IdUser);
            return userSaved;

        } catch (error) {
            throw error;
        }
    }
    
    async findByEmail(email: string): Promise<User> {
        const query = `
            CALL spPegarUserEmail(?)
        `;
        try {
            const [rows] = await this.db.query(query, [email]);
            const rowsArray = rows as Array<User[]>;
            const users = rowsArray[0][0];
            return users;
        } catch (error) {
            throw error;
        }
    }

    async findByCpfOrCnpjUser(cpfOrCnpjUser: string): Promise<User> {
        const query = `
            SELECT *
            FROM users
            WHERE CpfOrCnpjUser = ?
        `;
        try {
            const [rows] = await this.db.query(query, [cpfOrCnpjUser]);
            const users = rows as User[];
            return users[0];
        } catch (error) {
            throw error;
        }
    }
    
    async findById(id: number): Promise<User> {
        const query = `
            CALL spPegarUserId(?)
        `;
        try {
            const [rows] = await this.db.query(query, [id]);

            const rowsArray = rows as Array<User[]>;
            const users = rowsArray[0][0];
            
            return users;
        } catch (error) {
            throw error;
        }
    }
    
    async findByIdWithPassword(id: number): Promise<User> {
        const query = `
            SELECT
                IdUser, NomeUser, SenhaUser,
                EmailUser, TelUser,
                CpfOrCnpjUser, CrpUser,
                ImgUrlUser, GenUser, RulesUser, StsAtivoUser
            FROM users
            WHERE idUser = ?
        `;
        try {
            const [rows] = await this.db.query(query, [id]);
            const users = rows as User[];
            return users[0];
        } catch (error) {
            throw error;
        }
    }
    
    async remove(user: User): Promise<void> {
        let connection;
        const query = `
            CALL spExcluirUsuarios(?)
        `;

        try {
            connection = await this.db.getConnection();

            await connection.execute(query, [
                user.IdUser,
            ]);
        } catch (error) {
            throw error
        } finally {
            if(connection) connection.release()
        }
    }
    
    async findAll(): Promise<Array<User>> {
        const query = `
            SELECT
                IdUser as idUser, NomeUser as nomeuser, 
                EmailUser as emailuser, TelUser as teluser,
                CpfOrCnpjUser as cpforunpjUuser, CrpUser as crpuser,
                ImgUrlUser as imgurluser, GenUser as genuser, RulesUser as ruleuser
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