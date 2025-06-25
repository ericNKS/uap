import IConsultaRepository from "../Interfaces/IConsultaRepository";

export default class ChangeAppointmentStatus {
    constructor(
        private repository: IConsultaRepository
    ){}
    
    public async active(IdConsulta: number): Promise<void> {
        await this.repository.ativarConsulta(IdConsulta);
    }

    public async disable(IdConsulta: number): Promise<void> {
        await this.repository.desativarConsulta(IdConsulta);
    }
}