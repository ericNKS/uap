import mysql from 'mysql2/promise';
import { Database } from '../../../config/database/Database';
import IExpedienteRepository from '../Interfaces/IExpedienteRepository';
import { IOfficeHoursToAdd } from '../Interfaces/IOfficeHoursToAdd';
import Expediente from '../Entities/Expediente';
export default class ExpedienteRepository implements IExpedienteRepository{
    constructor(
        private db: mysql.Pool = Database
    ) {}
    
    public async adicionarExpediente(expediente: IOfficeHoursToAdd): Promise<void> {
        const query = `
            CALL spAdicionarExpediente(?,?,?,?)
        `;

        const dataToAdd = [
            expediente.IdUser,
            expediente.DtExpediente,
            expediente.HrInicioExpediente,
            expediente.HrFinalExpediente,
        ]

        try {
            await this.db.query(query, dataToAdd);
        } catch (error) {
            throw error;
        }
    }

    public async listarExpedientes(IdUser: number): Promise<Array<Expediente>> {
        const query = `
            CALL spListarExpedientes(?);
        `;

        try {
            const [rows] = await this.db.query(query, [IdUser]) as [Expediente[][], any];
            return rows[0];
        } catch (error) {
            throw error;
        }
    }


    public async changeStatusExpediente(IdUser: number, IdExpediente: number): Promise<void> {
        const query = `
            CALL spAtivarDesativarExpediente(?, ?)
        `;

        try {
            await this.db.query(query, [
                IdUser,
                IdExpediente
            ]);
        } catch (error) {
            throw error;
        }
    }

    public async excluirExpediente(IdExpediente: number): Promise<void> {
        const query = `
            CALL spExcluirExpediente(?)
        `;

        try {
            await this.db.query(query, [
                IdExpediente
            ]);
        } catch (error) {
            throw error;
        }
    }
}