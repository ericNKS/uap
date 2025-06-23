import mysql from 'mysql2/promise';
import { Database } from '../../../config/database/Database';
import IExpediente from '../Interfaces/IExpediente';
import Expediente from '../Entities/Expediente';
import { IOfficeHoursToAdd } from '../Interfaces/IOfficeHoursToAdd';
export default class ExpedienteRepository implements IExpediente{
    constructor(
        private db: mysql.Pool = Database
    ) {}
    
    public async adicionarExpediente(expediente: IOfficeHoursToAdd): Promise<Expediente> {
        const expedienteAdicionado = new Expediente()
        expedienteAdicionado.Idexpediente = 1;
        expedienteAdicionado.DtExpediente = new Date(expediente.DtExpediente);
        expedienteAdicionado.Hrexpediente = expediente.HrExpediente;
        expedienteAdicionado.Iduser = expediente.IdUser;
        expedienteAdicionado.Stsativoexpediente = expediente.StsAtivoExpediente;
        return expedienteAdicionado;
    }
}