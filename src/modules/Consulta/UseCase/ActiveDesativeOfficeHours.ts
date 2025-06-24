import IExpediente from "../Interfaces/IExpediente";

export default class ActiveDesativeOfficeHours {
    constructor(
        private repository: IExpediente
    ) {}

    public async execute(IdUser: number, IdExpediente: number): Promise<void> {
        this.repository.changeStatusExpediente(IdUser, IdExpediente)
    }
}