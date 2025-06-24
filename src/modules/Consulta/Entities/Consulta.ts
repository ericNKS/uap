export default class Consulta {
    public IdConsulta: number = 0;
    public IdPaciente: number = 0;
    public IdEspecialista: number = 0;
    public DtConsulta: Date = new Date();
    public DiaSemanaConsulta: number = 0;
    public HrConsulta: string = '';
    public InfoConsulta: string = '';
    public StsAtivoConsulta: string = 'n';

    public toJson(): Record<string, any> {
        return {
            IdConsulta: this.IdConsulta,
            IdPaciente: this.IdPaciente,
            IdEspecialista: this.IdEspecialista,
            DtConsulta: this.DtConsulta.toISOString(),
            DiaSemanaConsulta: this.DiaSemanaConsulta,
            HrConsulta: this.HrConsulta,
            InfoConsulta: this.InfoConsulta,
            StsAtivoConsulta: this.StsAtivoConsulta,
        }
    }
}