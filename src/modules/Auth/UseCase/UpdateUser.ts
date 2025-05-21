import UpdateUserDTO from "../DTO/UpdateUserDTO";
import User from "../Entities/User";
import IUserRepository from "../Interfaces/IUserRepository";
import bcrypt from "bcryptjs"

export default class UpdateUser {
    constructor(
        private userRepository: IUserRepository
    ) {}

    public async execute(idUser: number, userToUpdate: UpdateUserDTO): Promise<User> {
        try {
            let user = await this.userRepository.findByIdWithPassword(idUser);
            if(userToUpdate?.senhaUser){
                const err = await this.validatePassword(user, userToUpdate);
                if (err instanceof Error) {
                    throw err;
                }
                user.senhauser = await bcrypt.hash(userToUpdate.senhaUser.first, 10);
            }
    
            user.nomeuser = userToUpdate.nomeuser ?? user.nomeuser;
            user.emailuser = userToUpdate.emailuser ?? user.emailuser;
            user.teluser = userToUpdate.teluser ?? user.teluser;
            user.genuser = userToUpdate.genuser ?? user.genuser;
            user.imgurluser = userToUpdate.imgurluser ?? user.imgurluser;
    
            return await this.userRepository.update(user);
        } catch (error) {
            throw error;
        }
    }

    private async validatePassword(user: User, newUser: UpdateUserDTO): Promise<Error | null> {
        if(!newUser?.senhaUser) return null;
        if(newUser.senhaUser.first !== newUser.senhaUser.second) 
            return new Error('A senha esta diferente');
    
        const isValidPassword = await bcrypt.compare(newUser.senhaUser.old, user.senhauser);
        if(!isValidPassword) return new Error('Senha antiga invalida');

        return null;
        }
}