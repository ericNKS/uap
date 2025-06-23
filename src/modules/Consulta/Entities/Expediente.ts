export default class Expediente {
    public Idexpediente: number = 0;
    public Iduser: number = 0
    public DtExpediente: Date = new Date();
    public HrInicioExpediente: string = '';
    public HrFinalExpediente: string = '';
    public Stsativoexpediente: string = 's';

    public toJson(): Record<string, any> {
        return {
            Idexpediente: this.Idexpediente,
            DtExpediente: this.DtExpediente.toISOString(),
            HrInicioExpediente: this.HrInicioExpediente,
            HrFinalExpediente: this.HrFinalExpediente,
            Stsativoexpediente: this.Stsativoexpediente,
            Iduser: this.Iduser
        }
    }
}