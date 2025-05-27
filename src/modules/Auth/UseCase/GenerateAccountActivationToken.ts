import RedisService from "../../../config/database/RedisService";
import crypto from 'crypto';
import User from "../Entities/User";
import SendMail from "../../../UseCase/SendMail";


export default class GenerateAccountActivationToken {
    constructor(
        private redis: RedisService
    ) {}

    async execute(
        user: User,
        expirationTimeInMinute: number = 15
    ): Promise<void> {
        const userToken = crypto.randomBytes(32).toString('hex');

        const exp = Date.now() + (expirationTimeInMinute * 60);

        const emailActivation = {
            token: userToken,
            idUser: user.IdUser
        };

        this.redis.set(`user:tokenActivation:${userToken}`, JSON.stringify(emailActivation), exp);

        const sendMailService = new SendMail();

        const mensagem = {
            subject: '🎉 Bem-vindo(a) ao UAP! Ative sua conta agora.',
            body: `

<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Ativação de Conta - UAP</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      margin: 20px auto;
      padding: 20px;
      max-width: 600px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #007BFF;
      color: white;
      padding: 10px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      padding: 20px;
      color: #333;
      line-height: 1.6;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #999;
      padding: 10px;
    }
    a.button {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 15px;
      background-color: #007BFF;
      color: white;
      text-decoration: none;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Bem-vinde ao UAP!</h1>
    </div>
    <div class="content">
      <p>Olá, <strong>${user.NomeUser.split(' ')[0]}</strong>!</p>

      <p>Seja muito bem-vinde ao <strong>UAP</strong>! Estamos felizes em ter você com a gente.</p>

      <p>Para começar a aproveitar todos os recursos da nossa plataforma, clique no botão abaixo para ativar sua conta:</p>

      <p style="text-align: center;">
        <a href="http://localhost:3000/ativar/${userToken}" class="button">👉 Ativar minha conta 👈</a>
      </p>

      <p>Se o botão acima não funcionar, copie e cole o link abaixo no seu navegador:</p>

      <p><a href="http://localhost:3000/ativar/${userToken}">http://localhost:3000/ativar/${userToken}</a></p>

      <p>Este link é válido por 24 horas. Caso não tenha solicitado este cadastro, por favor, ignore esta mensagem.</p>

      <p>Se precisar de ajuda ou tiver dúvidas, estamos à disposição!</p>

      <p>Abraços,<br>Equipe UAP 🌟</p>
    </div>
    <div class="footer">
      &copy; 2025 UAP. Todos os direitos reservados.
    </div>
  </div>
</body>
</html>

            `
        }
        sendMailService.execute(mensagem, [user.EmailUser]);

    }
}