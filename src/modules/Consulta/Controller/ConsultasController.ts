import { FastifyReply, FastifyRequest } from "fastify";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import FormExceptions from "../../../utils/FormExceptions";
import ConsultaRepository from "../Repository/ConsultaRepository";
import AddConsultaDTO from "../DTO/AddConsultaDTO";
import AddConsulta from "../UseCase/AddConsulta";

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

            return reply.send({
                success: 'Expedientes salvo com sucesso!'
            });
        } catch (error) {
            return reply.send({
                error: 'Algo inesperado aconteceu, tente novamente mais tarde'
            });
        }
    }
}