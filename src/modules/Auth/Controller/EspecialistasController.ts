import { FastifyReply, FastifyRequest } from "fastify";
import { Database } from "../../../config/database/Database";
import mysql from 'mysql2/promise';
import AdicionarDescricaoDTO from "../DTO/AdicionarDescricaoDTO";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import FormExceptions from "../../../utils/FormExceptions";

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

    static async adicionarDescricao(
        req: FastifyRequest,
        reply: FastifyReply,
    ) {
        let adicionarDescricaoDTO: AdicionarDescricaoDTO;
        adicionarDescricaoDTO = plainToInstance(AdicionarDescricaoDTO, req.body);
        
        if (!adicionarDescricaoDTO) {
            return reply.code(400).send({ error: 'No update data provided' });
        }
        
        const validationsErr = await validate(adicionarDescricaoDTO);
        const err = FormExceptions(validationsErr);
        if (err) {
            return reply.code(400).send({ err });
        }
        
        let connection;
        const query = `
            CALL spAdicionarDescricao(?, ?)
        `;
    
        try {
            connection = await Database.getConnection();
            
            const resultRaw = await connection.execute(query, [
                req.user.IdUser,
                adicionarDescricaoDTO.DescricaoUser
            ]);

            return reply.code(204).send();
        } catch (error) {
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }
}