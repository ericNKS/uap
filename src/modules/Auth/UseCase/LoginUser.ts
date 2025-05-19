import { LoginDTO } from "../DTO/LoginDTO";
import User from "../Entities/User";
import IUserRepository from "../Interfaces/IUserRepository";
import ExceptionNotFound from "../Utils/ExceptionNotFound";
import ExceptionValidation from "../Utils/ExceptionValidation";
import JwtToken from "./JwtToken";
import bcrypt from "bcryptjs"


export default class LoginUser {
    public constructor(
        private userRepository: IUserRepository
    ) {}

    public async execute(form: LoginDTO): Promise<string> {
        const user = await this.validateUser(form)
        
        return JwtToken.generate(user)
    }

    private async validateUser(form: LoginDTO): Promise<User> {
        const userToValidate = await this.userRepository.findByEmail(form.emailUser);

        if(!userToValidate) {
            throw new ExceptionNotFound("email não encontrado");
        }
        
        const isPasswordValid = await bcrypt.compare(form.senhaUser, userToValidate.senhauser)

        if(!isPasswordValid) {
            throw new ExceptionValidation("Senha inválida")
        }

        return userToValidate;
    }
}