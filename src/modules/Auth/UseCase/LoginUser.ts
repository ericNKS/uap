import RedisService from "../../../config/database/RedisService";
import SendMail from "../../../UseCase/SendMail";
import { LoginDTO } from "../DTO/LoginDTO";
import User from "../Entities/User";
import IUserRepository from "../Interfaces/IUserRepository";
import ExceptionNotFound from "../Utils/ExceptionNotFound";
import ExceptionValidation from "../Utils/ExceptionValidation";
import GenerateAccountActivationToken from "./GenerateAccountActivationToken";
import JwtToken from "./JwtToken";
import bcrypt from "bcryptjs"


export default class LoginUser {
    private generateAccountActivationToken: GenerateAccountActivationToken;
    public constructor(
        private userRepository: IUserRepository,
        generateAccountActivationToken?: GenerateAccountActivationToken
    ) {
        this.generateAccountActivationToken = 
            generateAccountActivationToken || new GenerateAccountActivationToken(RedisService.getInstance(), new SendMail());
    }

    public async execute(form: LoginDTO): Promise<string> {
        const user = await this.validateUser(form)
        
        return JwtToken.generate(user)
    }

    private async validateUser(form: LoginDTO): Promise<User> {
        const userToValidate = await this.userRepository.findByEmail(form.EmailUser);

        if(!userToValidate) {
            throw new ExceptionNotFound("email não encontrado");
        }
        
        const isPasswordValid = await bcrypt.compare(form.SenhaUser, userToValidate.SenhaUser)

        if(!isPasswordValid) {
            throw new ExceptionValidation("Senha inválida");
        }

        if(userToValidate.StsVerificarEmail === false) {
            this.generateAccountActivationToken.execute(userToValidate);
            throw new ExceptionValidation("Conta não validada, verifique o seu email e tente novamente");
        }

        return userToValidate;
    }
}