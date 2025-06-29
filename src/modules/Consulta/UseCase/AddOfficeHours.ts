import Expediente from "../Entities/Expediente";
import IExpedienteRepository from "../Interfaces/IExpedienteRepository";
import { IOfficeHoursToAddService } from "../Interfaces/IOfficeHoursToAdd";

export default class AddOfficeHours {
    public constructor(
        private repository: IExpedienteRepository
    ) {}

    public async execute(expedientes: IOfficeHoursToAddService): Promise<void> {
        expedientes.OfficeHours.forEach(async (expediente) => {
            await this.repository.adicionarExpediente({
                IdUser: expedientes.IdUser,
                ...expediente,
            })
        });
    }
}