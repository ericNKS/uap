import Expediente from "../Entities/Expediente";
import IExpediente from "../Interfaces/IExpediente";
import { IOfficeHoursToAddService } from "../Interfaces/IOfficeHoursToAdd";

export default class AddOfficeHours {
    public constructor(
        private repository: IExpediente
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