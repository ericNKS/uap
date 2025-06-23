export default class AusenciasAgenda {
    public IdAusenciasAgenda: number = 0;
    public IdUser: number = 0
    public DtAusencia: Date = new Date();
    public Motivo: string = '';

    public toJson(): Record<string, any> {
        return {
            IdAusenciasAgenda: this.IdAusenciasAgenda,
            IdUser: this.IdUser,
        }
    }
}