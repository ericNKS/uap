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
        expedienteAdicionado.idexpediente = 1;
        expedienteAdicionado.dtexpediente = new Date(expediente.dtExpediente);
        expedienteAdicionado.hrexpediente = expediente.hrExpediente;
        expedienteAdicionado.iduser = expediente.idUser;
        expedienteAdicionado.stsativoexpediente = expediente.stsAtivoExpediente;
        return expedienteAdicionado;
    }
}