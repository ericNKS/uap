export default class Consulta {
    public idevento: number = 0
    public dtevento: Date = new Date();
    public hrevento: string = '';
    public localevento: string = '';
    public infoevento: string = '';
    public imgurlevento?: string = '';

    public toJson(): Record<string, any> {
        return {
            idevento: this.idevento,
            dtevento: this.dtevento.toISOString(),
            hrevento: this.hrevento,
            localevento: this.localevento,
            infoevento: this.infoevento,
            imgurlevento: this.imgurlevento || ''
        }
    }
}