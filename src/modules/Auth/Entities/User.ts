export default class User {
    public readonly idUser?: number = 0;
    public nomeuser: string = '';
    public emailuser: string = '';
    public senhauser: string = '';
    public teluser?: string = '';
    public cpforcnpjuser: string = '';
    public crpuser?: string = '';
    public imgurluser?: string = '';
    public genuser: string = '';
    public rulesuser: string = 'paciente';
    public stsativouser: string = '';

    public toJson(): Record<string, any> {
        return {
            idUser: this.idUser,
            nomeuser: this.nomeuser,
            emailuser: this.emailuser,
            senhauser: this.senhauser,
            teluser: this.teluser,
            cpforcnpjuser: this.cpforcnpjuser,
            crpuser: this.crpuser,
            imgurluser: this.imgurluser,
            genuser: this.genuser,
            rulesuser: this.rulesuser,
            stsativouser: this.stsativouser,
        }
    }
}