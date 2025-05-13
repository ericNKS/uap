export default class Consulta {
    public idconsulta: number = 0;
    public dtconsulta: Date = new Date();
    public hrconsulta: string = '';
    public espcconsulta: string = '';
    public infoconsulta?: string = '';
    public iduser?: number = 0;

    public toJson(): Record<string, any> {
        return {
            idconsulta: this.idconsulta,
            dtconsulta: this.dtconsulta.toISOString(),
            hrconsulta: this.hrconsulta,
            espcconsulta: this.espcconsulta,
            infoconsulta: this.infoconsulta,
            iduser: this.iduser
        }
    }
}