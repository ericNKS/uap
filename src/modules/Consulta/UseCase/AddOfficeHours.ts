import Expediente from "../Entities/Expediente";
import IExpediente from "../Interfaces/IExpediente";
import { IOfficeHoursToAddService } from "../Interfaces/IOfficeHoursToAdd";

export default class AddOfficeHours {
    public constructor(
        private repository: IExpediente
    ) {}

    public async execute(expedientes: IOfficeHoursToAddService): Promise<Expediente[]> {
        const expedienteArr: Array<Expediente> = [];

        expedientes.OfficeHours.forEach(async (expediente) => {
            let expedienteWasAdd = await this.repository.adicionarExpediente({
                IdUser: expedientes.IdUser,
                ...expediente,
            })
            
            expedienteArr.push(expedienteWasAdd);
        })


        return expedienteArr;
    }
}