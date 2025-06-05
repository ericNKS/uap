export default class Expediente {
    public IdExpediente: number = 0;
    public IdUser: number = 0
    public DtExpediente: Date = new Date();
    public HrExpediente: string = '';
    public StsAtivoExpediente: string = 's';

    public toJson(): Record<string, any> {
        return {
            IdExpediente: this.IdExpediente,
            IdUser: this.IdUser,
            DtExpediente: this.DtExpediente.toISOString(),
            HrExpediente: this.HrExpediente,
            StsAtivoExpediente: this.StsAtivoExpediente,
        }
    }
}