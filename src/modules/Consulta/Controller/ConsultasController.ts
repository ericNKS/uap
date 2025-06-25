import { FastifyReply, FastifyRequest } from "fastify";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import FormExceptions from "../../../utils/FormExceptions";
import ConsultaRepository from "../Repository/ConsultaRepository";
import AddConsultaDTO from "../DTO/AddConsultaDTO";
import AddConsulta from "../UseCase/AddConsulta";
import ListAppointmentNotConfirmed from "../UseCase/ListAppointmentNotConfirmed";
import ListAppointmentConfirmed from "../UseCase/ListAppointmentConfirmed";
import ChangeAppointmentStatus from "../UseCase/ChangeAppointmentStatus";

export default class ConsultaController {
    private static repository: ConsultaRepository = new ConsultaRepository();

    public static async store(
        req: FastifyRequest,
        reply: FastifyReply
    ) {
        const IdUser = req.user.IdUser;

        const addConsultaDTO = plainToInstance(AddConsultaDTO, req.body);
        const validationsErr = await validate(addConsultaDTO);
        const err = FormExceptions(validationsErr);
        if(err) {
            return reply.code(400).send(err);
        }

        const addConsulta = new AddConsulta(this.repository)
        
        try {
            await addConsulta.execute(IdUser, addConsultaDTO)

            return reply.code(201).send({
                success: 'Expedientes salvo com sucesso!'
            });
        } catch (error) {
            return reply.code(500).send({
                error: 'Algo inesperado aconteceu, tente novamente mais tarde'
            });
        }
    }

    public static async listConfirmed(
        req: FastifyRequest,
        reply: FastifyReply
    ) {
        const IdUser = req.user.IdUser;

        const addConsulta = new ListAppointmentConfirmed(this.repository)
        
        try {
            const isEspecialista = req.user.rules.includes('RULE_ESPECIALISTA_ATIVO')
            
            if(isEspecialista){
                const consultas = await addConsulta.especialista(IdUser);
                return reply.send(consultas);
            }

            const consultas = await addConsulta.paciente(IdUser);
            return reply.send(consultas);

        } catch (error) {
            return reply.code(500).send({
                error: 'Algo inesperado aconteceu, tente novamente mais tarde'
            });
        }
    }

    public static async listNotConfirmed(
        req: FastifyRequest,
        reply: FastifyReply
    ) {

        const IdUser = req.user.IdUser;

        const addConsulta = new ListAppointmentNotConfirmed(this.repository)
        
        try {
            const consultas = await addConsulta.execute(IdUser);

            return reply.send(consultas);
        } catch (error) {
            return reply.code(500).send({
                error: 'Algo inesperado aconteceu, tente novamente mais tarde'
            });
        }
    }

    public static async active(
        req: FastifyRequest<{
            Params: {
                id: number
            }
        }>,
        reply: FastifyReply
    ) {
        const IdConsulta = req.params.id;

        const addConsulta = new ChangeAppointmentStatus(this.repository)
        
        try {
            const consultas = await addConsulta.active(IdConsulta);

            return reply.code(204).send(consultas);
        } catch (error) {
            return reply.code(500).send({
                error: 'Algo inesperado aconteceu, tente novamente mais tarde'
            });
        }
    }

    public static async disable(
        req: FastifyRequest<{
            Params: {
                id: number
            }
        }>,
        reply: FastifyReply
    ) {
        const IdConsulta = req.params.id;

        const addConsulta = new ChangeAppointmentStatus(this.repository)
        
        try {
            await addConsulta.disable(IdConsulta);

            return reply.code(204).send();
        } catch (error) {
            return reply.code(500).send({
                error: 'Algo inesperado aconteceu, tente novamente mais tarde'
            });
        }
            
    }
}