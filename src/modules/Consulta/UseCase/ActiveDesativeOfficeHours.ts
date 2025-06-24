import IExpedienteRepository from "../Interfaces/IExpedienteRepository";

export default class ActiveDesativeOfficeHours {
    constructor(
        private repository: IExpedienteRepository
    ) {}

    public async execute(IdUser: number, IdExpediente: number): Promise<void> {
        this.repository.changeStatusExpediente(IdUser, IdExpediente)
    }
}