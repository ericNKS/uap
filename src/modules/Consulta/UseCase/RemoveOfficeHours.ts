import IExpedienteRepository from "../Interfaces/IExpedienteRepository";

export default class RemoveOfficeHours {
    constructor(
        private repository: IExpedienteRepository
    ) {}

    public async execute(IdExpediente: number): Promise<void> {
        await this.repository.excluirExpediente(IdExpediente);
    }
}