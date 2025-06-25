import Consulta from "../Entities/Consulta";
import IConsultaRepository from "../Interfaces/IConsultaRepository";

export default class ListAppointmentNotConfirmed {
    constructor(
        private repository: IConsultaRepository
    ){}

    public async execute(IdEspecialista: number): Promise<Array<Consulta>> {
        return await this.repository.listarConsultasNaoConfirmadas(IdEspecialista);
    }
}