export default class Expediente {
    public idexpediente: number = 0;
    public dtexpediente: Date = new Date();
    public hrexpediente: string = '';
    public stsativoexpediente: string = 's';
    public iduser: number = 0

    public toJson(): Record<string, any> {
        return {
            idexpediente: this.idexpediente,
            dtexpediente: this.dtexpediente.toISOString,
            hrexpediente: this.hrexpediente,
            stsativoexpediente: this.stsativoexpediente,
            iduser: this.iduser
        }
    }
}