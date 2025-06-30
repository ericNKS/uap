import { FastifyReply, FastifyRequest } from "fastify";
import { Database } from "../../../config/database/Database";
import mysql from 'mysql2/promise';

export default class EspecialistaController {
    static async index(
        req: FastifyRequest,
        reply: FastifyReply,
    ) {
        let connection;
        const query = `
            CALL spListarEspecialistasAtivos()
        `;
    
        try {
            connection = await Database.getConnection();
            
            const resultRaw = await connection.execute<mysql.RowDataPacket[]>(query);
            const result = resultRaw[0][0];

            const especialistas = result.map((user: {
                IdUser: number;
                NomeUser: string;
                EmailUser?: string;
                TelUser: string;
                CpfOrCnpjUser?: string;
                CrpUser: string;
                DescricaoUser: string;
                ImgUrlUser: string | null;
                GenUser: string;
                PronomeUser: string;
            }) => {
                const newUser = { ...user }; 
                delete newUser.EmailUser;
                delete newUser.CpfOrCnpjUser;
                return newUser;
            });

            return reply.send(especialistas);
        } catch (error) {
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }
}