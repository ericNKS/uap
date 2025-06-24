import mysql from 'mysql2/promise';
import { Database } from '../../../config/database/Database';
import Consulta from '../Entities/Consulta';
import IConsultaRepository from '../Interfaces/IConsultaRepository';

export default class ConsultaRepository implements IConsultaRepository{
    constructor(
        private db: mysql.Pool = Database
    ) {}
    
    
    public async adicionarConsulta(consulta: Consulta): Promise<void> {
        const query = `
        CALL spAdicionarConsulta(?, ?, ?, ?, ?, ?)
        `;
        
        const dataToAdd = [
            consulta.IdPaciente,
            consulta.IdEspecialista,
            consulta.DtConsulta,
            consulta.DiaSemanaConsulta,
            consulta.HrConsulta,
            consulta.InfoConsulta
        ];
        
        try {
            await this.db.query(query, dataToAdd)
        } catch (error) {
            throw error;
        }
    }

    public async listarConsultasNaoConfirmadas(IdEspecialista: number): Promise<Array<Consulta>> {
        const query = `
            CALL spListarConsultasNaoConfirmadas(?)
        `;
        
        try {
            const [rows] = await this.db.query(query, [IdEspecialista]) as [Consulta[][], any];
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    public async listarConsultasConfirmadasPorPaciente(IdPaciente: number): Promise<Array<Consulta>> {
        const query = `
            CALL spListarConsultasConfirmadasPorPaciente(?)
        `;
        
        try {
            const [rows] = await this.db.query(query, [IdPaciente]) as [Consulta[][], any];
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    public async listarConsultasConfirmadasPorEspecialista(IdEspecialista: number): Promise<Array<Consulta>> {
        const query = `
            CALL spListarConsultasConfirmadasPorEspecialista(?)
        `;
        
        try {
            const [rows] = await this.db.query(query, [IdEspecialista]) as [Consulta[][], any];
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    public async ativarConsulta(IdConsulta: number): Promise<void> {
        const query = `
            CALL spAtivarConsulta(?)
        `;
        
        try {
            await this.db.query(query, [IdConsulta]);
        } catch (error) {
            throw error;
        }
    }

    public async desativarConsulta(IdConsulta: number): Promise<void> {
        const query = `
            CALL spDesativarConsulta(?)
        `;
        
        try {
            await this.db.query(query, [IdConsulta]);
        } catch (error) {
            throw error;
        }
    }
}