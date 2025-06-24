import mysql from 'mysql2/promise';
import { Database } from '../../../config/database/Database';
import IExpediente from '../Interfaces/IExpediente';
import { IOfficeHoursToAdd } from '../Interfaces/IOfficeHoursToAdd';
export default class ExpedienteRepository implements IExpediente{
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
}