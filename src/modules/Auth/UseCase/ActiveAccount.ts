import User from "../Entities/User";
import IUserRepository from "../Interfaces/IUserRepository";
import ExceptionNotFound from "../Utils/ExceptionNotFound";

export default class ActiveAccount {
    constructor(
        private userRepository: IUserRepository
    ){}

    public async execute(idUser: number): Promise<User> {
        const user = await this.userRepository.findById(idUser);

        console.log(user);

        if(!user)  throw new ExceptionNotFound('Usuario nao encontrado');
        await this.userRepository.activeByEmail(user);

        return user;
    }
}