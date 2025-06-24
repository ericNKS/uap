import User from "../../Auth/Entities/User";
import Expediente from "../Entities/Expediente";
import IExpediente from "../Interfaces/IExpediente";

export default class ListOfficeHours {
    constructor(
        private repository: IExpediente
    ) {}

    public async execute(especialista: User): Promise<Array<Expediente>> {
        if(!especialista.IdUser) throw new Error('Especialista não encontrado');
        // await this.repository.changeStatusExpediente(especialista.IdUser, 1);
        return await this.repository.listarExpedientes(especialista.IdUser);
    }
}