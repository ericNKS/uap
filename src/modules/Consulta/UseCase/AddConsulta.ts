import AddConsultaDTO from "../DTO/AddConsultaDTO";
import Consulta from "../Entities/Consulta";
import IConsultaRepository from "../Interfaces/IConsultaRepository";

export default class AddConsulta {
    constructor(
        private repository: IConsultaRepository
    ){}

    public async execute(idPaciente: number, consultaDTO: AddConsultaDTO): Promise<Consulta> {
        const consulta = new Consulta()
        consulta.DiaSemanaConsulta = consultaDTO.DiaSemanaConsulta;
        consulta.DtConsulta = consultaDTO.DtConsulta;
        consulta.HrConsulta = consultaDTO.HrConsulta;
        consulta.IdEspecialista = consultaDTO.IdEspecialista;
        consulta.IdPaciente = idPaciente;
        consulta.InfoConsulta = consultaDTO.InfoConsulta;

        await this.repository.adicionarConsulta(consulta)
        return consulta;
    }
}