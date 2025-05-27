import {CreateUserRequest} from "../DTO/CreateUserRequest";
import User from "../Entities/User";
import IUserRepository from "../Interfaces/IUserRepository";
import bcrypt from "bcryptjs"
import ExceptionValidation from "../Utils/ExceptionValidation";

export default class CreateUserPaciente {
    public constructor(
        private userRepository: IUserRepository
    ) {}

    public async paciente(userRequest: CreateUserRequest): Promise<User> {
        try {
            const err = await this.validateUser(userRequest)
            if(err != null) {
                throw new ExceptionValidation(err);
            }
            
            const hashedPassword = await bcrypt.hash(userRequest.SenhaUser.first, 10)

            const userToSave: User = {
                NomeUser: userRequest.NomeUser,
                EmailUser: userRequest.EmailUser.toLowerCase(),
                SenhaUser: hashedPassword,
                TelUser: userRequest.TelUser || '',
                CpfOrCnpjUser: userRequest.CpfOrCnpjUser,
                CrpUser: userRequest.CrpUser || '',
                ImgUrlUser: userRequest.ImgUrlUser || '',
                GenUser: userRequest.GenUser,
                RulesUser: userRequest.RulesUser || 'RULE_PACIENTE',
                StsVerificarEmail: false,
                StsAtivoUser: 's',
            } as User;

            const user = await this.userRepository.createPaciente(userToSave)
            
            return user;
        } catch (error) {
            throw error;
        }
    }

    public async especialista(userRequest: CreateUserRequest): Promise<User> {
        try {
            const err = await this.validateUser(userRequest)
            if(err) {
                throw new Error(err);
            }
            const hashedPassword = await bcrypt.hash(userRequest.SenhaUser.first, 10)

            const userToSave: User = {
                NomeUser: userRequest.NomeUser,
                EmailUser: userRequest.EmailUser.toLowerCase(),
                SenhaUser: hashedPassword,
                TelUser: userRequest.TelUser || '',
                CpfOrCnpjUser: userRequest.CpfOrCnpjUser,
                CrpUser: userRequest.CrpUser || '',
                ImgUrlUser: userRequest.ImgUrlUser || '',
                GenUser: userRequest.GenUser,
                RulesUser: userRequest.RulesUser || 'RULE_ESPECIALISTA',
                StsVerificarEmail: false,
                StsAtivoUser: 's',
            } as User;

            const user = await this.userRepository.createEspecialista(userToSave)
            
            return user;
        } catch (error) {
            throw error;
        }
    }

    private async validateUser(user: CreateUserRequest): Promise<string | null> {
        if(user.SenhaUser.first !== user.SenhaUser.second) {
            return 'password validation is invalid';
        }

        let hasUser = await this.userRepository.findByEmail(user.EmailUser);
        if(hasUser) {
            return 'User already exists';
        }

        hasUser = await this.userRepository.findByCpfOrCnpjUser(user.CpfOrCnpjUser);
        if(hasUser) {
            return 'User already exists';
        }

        return null;
    }
}