export default class Evento {
    public IdEvento: number = 0;
    public NomeEvento: string = '';
    public DtEvento: Date = new Date();
    public HrEvento: string = '';
    public LocalEvento: string = '';
    public InfoEvento: string = '';
    public ImgUrlEvento: string = '';
    public StsAtivoEvento: string = '';

    public toJson(): Record<string, any> {
        return {
            IdEvento: this.IdEvento,
            NomeEvento: this.NomeEvento,
            DtEvento: this.DtEvento.toISOString(),
            HrEvento: this.HrEvento,
            LocalEvento: this.LocalEvento,
            InfoEvento: this.InfoEvento,
            ImgUrlEvento: this.ImgUrlEvento || '',
            StsAtivoEvento: this.StsAtivoEvento,
        }
    }
}