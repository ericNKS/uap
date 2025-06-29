import Consulta from "../Entities/Consulta";
import IConsultaRepository from "../Interfaces/IConsultaRepository";

export default class ListAppointmentConfirmed {
    constructor(
        private repository: IConsultaRepository
    ){}

    public async especialista(IdEspecialista: number): Promise<Array<Consulta>> {
        return await this.repository.listarConsultasConfirmadasPorEspecialista(IdEspecialista);
    }

    public async paciente(IdPaciente: number): Promise<Array<Consulta>> {
        return await this.repository.listarConsultasConfirmadasPorPaciente(IdPaciente);
    }
}