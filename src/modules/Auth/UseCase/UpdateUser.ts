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
            if(userToUpdate?.SenhaUser){
                const err = await this.validatePassword(user, userToUpdate);
                if (err instanceof Error) {
                    throw err;
                }
                user.SenhaUser = await bcrypt.hash(userToUpdate.SenhaUser.first, 10);
            }
    
            user.NomeUser = userToUpdate.NomeUser ?? user.NomeUser;
            user.EmailUser = userToUpdate.EmailUser ?? user.EmailUser;
            user.TelUser = userToUpdate.TelUser ?? user.TelUser;
            user.GenUser = userToUpdate.GenUser ?? user.GenUser;
            user.ImgUrlUser = userToUpdate.ImgUrlUser ?? user.ImgUrlUser;
    
            return await this.userRepository.update(user);
        } catch (error) {
            throw error;
        }
    }

    private async validatePassword(user: User, newUser: UpdateUserDTO): Promise<Error | null> {
        if(!newUser?.SenhaUser) return null;
        if(newUser.SenhaUser.first !== newUser.SenhaUser.second) 
            return new Error('A senha esta diferente');
    
        const isValidPassword = await bcrypt.compare(newUser.SenhaUser.old, user.SenhaUser);
        if(!isValidPassword) return new Error('Senha antiga invalida');

        return null;
    }
}