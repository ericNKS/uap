export default class Expediente {
    public IdExpediente: number = 0;
    public IdUser: number = 0
    public DtExpediente: Date = new Date();
    public HrExpedienteInicio: string = '';
    public HrExpedienteFinal: string = '';

    public toJson(): Record<string, any> {
        return {
            IdExpediente: this.IdExpediente,
            IdUser: this.IdUser,
            DtExpediente: this.DtExpediente,
            HrExpedienteInicio: this.HrExpedienteInicio,
            HrExpedienteFinal: this.HrExpedienteFinal,
        }
    }
}