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
    
    async update(user: User): Promise<User> {
        const updateWithouPasswordQuery = `
            UPDATE
                users u
            SET
                u.NomeUser = ?,
                u.EmailUser = ?,
                u.TelUser = ?,
                u.GenUser = ?,
                u.ImgUrlUser = ?,
                u.StsAtivoUser = ?
            WHERE
                u.IdUser = ?;
        `;
        const updateWithPasswordQuery = `
            UPDATE
                users u
            SET
                u.SenhaUser = ?,
                u.NomeUser = ?,
                u.EmailUser = ?,
                u.TelUser = ?,
                u.GenUser = ?,
                u.ImgUrlUser = ?,
                u.StsAtivoUser = ?
            WHERE
                u.IdUser = ?;
        `;

        const selectQuery = `
            SELECT
                IdUser as idUser, NomeUser as nomeuser, 
                EmailUser as emailuser, TelUser as teluser,
                CpfOrCnpjUser as cpforunpjUuser, CrpUser as crpuser,
                ImgUrlUser as imgurluser, GenUser as genuser, RulesUser as rulesuser, StsAtivoUser as stsativouser
            FROM users
            WHERE IdUser = ?
        `;

        try {
            console.log('user.idUser', user.senhauser);
            let updateQuery = updateWithouPasswordQuery;
            let values = [
                user.nomeuser,
                user.emailuser,
                user.teluser,
                user.genuser,
                user.imgurluser,
                user.stsativouser,
                user.idUser
            ];

            if(user.senhauser){
                updateQuery = updateWithPasswordQuery;
                values = [
                    user.senhauser,
                    user.nomeuser,
                    user.emailuser,
                    user.teluser,
                    user.genuser,
                    user.imgurluser,
                    user.stsativouser,
                    user.idUser
                ];    
            }

            await this.db.query(updateQuery, values);

            const [rows] = await this.db.query(selectQuery, [user.idUser]);
            const users = rows as User[];
            return users[0];

        } catch (error) {
            throw error;
        }
    }
    
    async findByEmail(email: string): Promise<User> {
        const query = `
            SELECT
                IdUser as idUser, NomeUser as nomeuser, 
                EmailUser as emailuser, TelUser as teluser,
                CpfOrCnpjUser as cpforunpjUuser, CrpUser as crpuser,
                ImgUrlUser as imgurluser, GenUser as genuser, RulesUser as rulesuser, StsAtivoUser as stsativouser
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
            SELECT
                IdUser as idUser, NomeUser as nomeuser, 
                EmailUser as emailuser, TelUser as teluser,
                CpfOrCnpjUser as cpforunpjUuser, CrpUser as crpuser,
                ImgUrlUser as imgurluser, GenUser as genuser, RulesUser as rulesuser, StsAtivoUser as stsativouser
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
                user.idUser,
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