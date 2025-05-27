interface IUser {
    IdUser: number,
    NomeUser: string,
    EmailUser: string,
    SenhaUser: string,
    TelUser?: string,
    CpfOrCnpjUser: string,
    CrpUser?: string,
    ImgUrlUser?: string,
    GenUser: string,
    PronomeUser: string,
    RulesUser: string,
    StsVerificarEmail: boolean,
    StsAtivoUser: string
}

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
    public StsVerificarEmail: boolean = false;
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

    static get(body: IUser): User {
        return {
            IdUser: body.IdUser,
            NomeUser: body.NomeUser,
            EmailUser: body.EmailUser,
            SenhaUser: body.SenhaUser,
            TelUser: body.TelUser,
            CpfOrCnpjUser: body.CpfOrCnpjUser,
            CrpUser: body.CrpUser,
            ImgUrlUser: body.ImgUrlUser,
            GenUser: body.GenUser,
            PronomeUser: body.PronomeUser,
            RulesUser: body.RulesUser,
            StsVerificarEmail: body.StsVerificarEmail,
            StsAtivoUser: body.StsAtivoUser,
        } as User
    }
}