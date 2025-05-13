export default class Consulta {
    public idusereventos: number = 0;
    public iduser: number = 0;
    public idevento: number = 0;
    

    public toJson(): Record<string, any> {
        return {
            idusereventos: this.idusereventos,
            iduser: this.iduser,
            idevento: this.idevento
        }
    }
}