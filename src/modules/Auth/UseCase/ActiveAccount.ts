import User from "../Entities/User";
import IUserRepository from "../Interfaces/IUserRepository";

export default class ActiveAccount {
    constructor(
        private userRepository: IUserRepository
    ){}

    public async execute(idUser: number): Promise<User> {
        const user = await this.userRepository.findById(idUser);

        user.stsativouser = 's';

        await this.userRepository.update(user);

        return user;
    }
}