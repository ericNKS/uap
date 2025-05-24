import dotenv from 'dotenv';

dotenv.config()

type remetente = {
    from: string,
    host: string,
    password: string,
    port: number
}

type mensagem = {
    subject: string,
    body: string
}

type envio = {
    remetente: remetente,
    mensagem: mensagem,
    destinatarios: Array<string>
}

export default class SendMail {
    private urlEmailService: string;
    private remetente: remetente;

    constructor(){
        const [host, from, port, password, urlEmailService] = [
            process.env.EMAIL_HOST,
            process.env.EMAIL_FROM,
            process.env.EMAIL_PORT,
            process.env.EMAIL_PASSWORD,
            process.env.EMAIL_URL_SERVICE,
        ];

        if(!host || !from || !port || !password || !urlEmailService) {
            throw new Error('Não é possível enviar email sem o remetente completo');
        }
        console.log('url');
        console.log(urlEmailService);
        this.urlEmailService = urlEmailService;

        this.remetente = {
            from,
            host,
            password,
            port: parseInt(port)
        };
    }

    public async execute(
        mensagem: mensagem,
        destinatarios: Array<string>
    ): Promise<void> {
        const body: envio = {
            remetente: this.remetente,
            mensagem,
            destinatarios
        }

        await fetch(this.urlEmailService, {
            method: 'POST',
            body: JSON.stringify(body)
        })
    }
}