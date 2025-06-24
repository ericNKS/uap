import { FastifyReply, FastifyRequest } from "fastify";
import ExpedienteRepository from "../Repository/ExpedienteRepository";
import AddOfficeHours from "../UseCase/AddOfficeHours";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import FormExceptions from "../../../utils/FormExceptions";
import addOfficeHoursDTO from "../DTO/AddOfficeHoursDTO";
import { IOfficeHours } from "../Interfaces/IOfficeHoursToAdd";

export default class OfficeHoursController {
    private static repository: ExpedienteRepository = new ExpedienteRepository();

    public static async store(
        req: FastifyRequest,
        reply: FastifyReply
    ) {
        const IdUser = req.user.IdUser;

        const OfficeHours = plainToInstance(addOfficeHoursDTO, req.body);
        const validationsErr = await validate(OfficeHours);
        const err = FormExceptions(validationsErr);
        if(err) {
            return reply.code(400).send(err);
        }

        const addOfficeHoursService = new AddOfficeHours(this.repository)

        const officeHoursMapped: IOfficeHours[] = OfficeHours.expedientes.map(exp => ({
            DtExpediente: exp.DtExpediente,
            HrInicioExpediente: exp.HrInicioExpediente,
            HrFinalExpediente: exp.HrFinalExpediente
        }));
        
        try {
            await addOfficeHoursService.execute({
                IdUser,
                OfficeHours: officeHoursMapped

            })

            return reply.send({
                success: 'Expedientes salvo com sucesso!'
            });
        } catch (error) {
            return reply.send({
                error: 'Algo inesperado aconteceu, tente novamente mais tarde'
            });
        }
    }

    public static async list(
        req: FastifyRequest,
        reply: FastifyReply
    ) {

        return reply.send({
            error: 'to-do'
        });
    }

    public static async changeStatusOfficeHours(
        req: FastifyRequest,
        reply: FastifyReply
    ) {

        return reply.send({
            error: 'to-do'
        });
    }
}