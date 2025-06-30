import { FastifyReply, FastifyRequest } from "fastify";
import ExpedienteRepository from "../Repository/ExpedienteRepository";
import AddOfficeHours from "../UseCase/AddOfficeHours";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import FormExceptions from "../../../utils/FormExceptions";
import addOfficeHoursDTO from "../DTO/AddOfficeHoursDTO";
import { IOfficeHours } from "../Interfaces/IOfficeHoursToAdd";
import ListOfficeHours from "../UseCase/ListOfficeHours";
import UserRepository from "../../Auth/Repository/UserRepository";
import { Database } from "../../../config/database/Database";
import ActiveDesativeOfficeHours from "../UseCase/ActiveDesativeOfficeHours";
import RemoveOfficeHours from "../UseCase/RemoveOfficeHours";

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

            return reply.code(201).send({
                success: 'Expedientes salvo com sucesso!'
            });
        } catch (error) {
            return reply.code(500).send({
                error: 'Algo inesperado aconteceu, tente novamente mais tarde'
            });
        }
    }

    public static async list(
        req: FastifyRequest<{
            Params: {
                especialista: number
            }
        }>,
        reply: FastifyReply
    ) {

        const listOfficeHoursService = new ListOfficeHours(this.repository);

        const userRepository = new UserRepository(Database);

        const especialistaId = req.params.especialista;
        try {
            const user = await userRepository.findById(especialistaId);
        
            const expedientes = await listOfficeHoursService.execute(user);

            return reply.send({
                expedientes
            });
        } catch (error) {
            return reply.code(500).send({
                error: 'Algo inesperado aconteceu, tente novamente mais tarde',
                message: error
            });
        }
    }

    public static async changeStatusOfficeHours(
        req: FastifyRequest<{
            Params: {
                id: number
            }
        }>,
        reply: FastifyReply
    ) {
        const IdUser = req.user.IdUser;
        const IdExpediente = req.params.id;

        const activeDesativeOfficeHoursService = new ActiveDesativeOfficeHours(this.repository)

        try {
            activeDesativeOfficeHoursService.execute(IdUser, IdExpediente);
            return reply.send({
                success: 'Status atualizado com sucesso'
            });
        } catch (error) {
            return reply.code(500).send({
                error: 'Algo inesperado aconteceu, tente novamente mais tarde'
            });
        }
    }

    public static async delete(
        req: FastifyRequest<{
            Params: {
                id: number
            }
        }>,
        reply: FastifyReply
    ) {
        const IdExpediente = req.params.id;
        const service = new RemoveOfficeHours(this.repository);

        await service.execute(IdExpediente);

        return reply.code(204).send();
    }
}