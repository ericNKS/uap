export default class Expediente {
    public Idexpediente: number = 0;
    public DtExpediente: Date = new Date();
    public Hrexpediente: string = '';
    public Stsativoexpediente: string = 's';
    public Iduser: number = 0

    public toJson(): Record<string, any> {
        return {
            Idexpediente: this.Idexpediente,
            DtExpediente: this.DtExpediente.toISOString(),
            Hrexpediente: this.Hrexpediente,
            Stsativoexpediente: this.Stsativoexpediente,
            Iduser: this.Iduser
        }
    }
}