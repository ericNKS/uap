import { FastifyReply, FastifyRequest } from "fastify";
import ExpedienteRepository from "../Repository/ExpedienteRepository";
import AddOfficeHours from "../UseCase/AddOfficeHours";

export default class OfficeHoursController {
    private static repository: ExpedienteRepository = new ExpedienteRepository();

    public static async store(
        req: FastifyRequest,
        reply: FastifyReply
    ) {
        const addOfficeHoursService = new AddOfficeHours(this.repository)

        const teste = await addOfficeHoursService.execute({
            IdUser: req.user.IdUser,
            OfficeHours: [
                {
                    DtExpediente: new Date('10-6-2025'),
                    HrInicioExpediente: '12:00',
                    HrFinalExpediente: '12:00',
                    StsAtivoExpediente: 's'
                }
            ]

        })

        return reply.send({
            success: teste[0]
        });
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