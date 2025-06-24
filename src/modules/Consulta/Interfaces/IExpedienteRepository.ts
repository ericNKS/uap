import Expediente from "../Entities/Expediente";
import {IOfficeHoursToAdd} from "./IOfficeHoursToAdd";

export default interface IExpedienteRepository {
    adicionarExpediente: (expediente: IOfficeHoursToAdd) => Promise<void>
    listarExpedientes: (IdUser: number) => Promise<Array<Expediente>>
    changeStatusExpediente: (IdUser: number, IdExpediente: number) => Promise<void>
}