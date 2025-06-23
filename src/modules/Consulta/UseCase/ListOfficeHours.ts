import Expediente from "../Entities/Expediente";
import IExpediente from "../Interfaces/IExpediente";

export default class ListOfficeHours {
    constructor(
        private repository: IExpediente
    ) {}

    public async execute(): Promise<Array<Expediente>> {
        return []
    }
}