import Expediente from "../Entities/Expediente";
import {IOfficeHoursToAdd} from "./IOfficeHoursToAdd";

export default interface IExpediente {
    adicionarExpediente: (expediente: IOfficeHoursToAdd) => Promise<void>
}