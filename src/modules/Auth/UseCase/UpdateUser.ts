import UpdateUserDTO from "../DTO/UpdateUserDTO";
import User from "../Entities/User";
import IUserRepository from "../Interfaces/IUserRepository";

export default class UpdateUser {
    constructor(
        private userRepository: IUserRepository
    ) {}

    public async execute(idUser: number, userToUpdate: UpdateUserDTO): Promise<User> {
        let user = await this.userRepository.findById(idUser);
        user = this.validatePassword(user, userToUpdate) ?? user;

        user.nomeuser = userToUpdate.nomeuser ?? user.nomeuser;

        user.emailuser = userToUpdate.emailuser ?? user.emailuser;

        user.teluser = userToUpdate.teluser ?? user.teluser;

        user.genuser = userToUpdate.genuser ?? user.genuser;
        
        user.imgurluser = userToUpdate.imgurluser ?? user.imgurluser;

        return await this.userRepository.update(user);
    }

    private validatePassword(user: User, newUser: UpdateUserDTO): User | null {
        if(!newUser.senhaUser) return null;

        if(newUser.senhaUser.first !== newUser.senhaUser.second) throw new Error('A senha esta diferente');

        if(user.senhauser != newUser.senhaUser.first) throw new Error('Senha antiga invalida');

        user.senhauser = newUser.senhaUser.first;
        return user;
    }
}