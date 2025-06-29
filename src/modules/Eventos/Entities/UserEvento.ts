export default class UserEvento {
    public IdUserEventos: number = 0;
    public IdUser: number = 0;
    public IdEvento: number = 0;
    

    public toJson(): Record<string, any> {
        return {
            IdUserEventos: this.IdUserEventos,
            IdUser: this.IdUser,
            IdEvento: this.IdEvento
        }
    }
}