export default class User {
    public readonly IdUser?: number = 0;
    public NomeUser: string = '';
    public EmailUser: string = '';
    public SenhaUser: string = '';
    public TelUser?: string = '';
    public CpfOrCnpjUser: string = '';
    public CrpUser?: string = '';
    public ImgUrlUser?: string = '';
    public GenUser: string = '';
    public PronomeUser: string = '';
    public RulesUser: string = 'RULE_PACIENTE';
    public StsVerificarEmail: string = '';
    public StsAtivoUser: string = '';

    public toJson(): Record<string, any> {
        return {
            IdUser: this.IdUser,
            NomeUser: this.NomeUser,
            EmailUser: this.EmailUser,
            TelUser: this.TelUser,
            CpfOrCnpjUser: this.CpfOrCnpjUser,
            CrpUser: this.CrpUser,
            ImgUrlUser: this.ImgUrlUser,
            GenUser: this.GenUser,
            PronomeUser: this.PronomeUser,
            RulesUser: this.RulesUser,
            StsVerificarEmail: this.StsVerificarEmail,
            StsAtivoUser: this.StsAtivoUser,
        }
    }
}