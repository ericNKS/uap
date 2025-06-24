import Consulta from "../Entities/Consulta";
import {IOfficeHoursToAdd} from "./IOfficeHoursToAdd";

export default interface IConsultaRepository {
    adicionarConsulta: (consulta: Consulta) => Promise<void>
    listarConsultasNaoConfirmadas: (IdEspecialista: number) => Promise<Array<Consulta>>
    listarConsultasConfirmadasPorPaciente: (IdPaciente: number) => Promise<Array<Consulta>>
    listarConsultasConfirmadasPorEspecialista: (IdEspecialista: number) => Promise<Array<Consulta>>
    ativarConsulta: (IdConsulta: number) => Promise<void>
    desativarConsulta: (IdConsulta: number) => Promise<void>
}