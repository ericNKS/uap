import UpdatePasswordUserDTO from "../DTO/UpdatePasswordUserDTO";
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
            let user = await this.userRepository.findById(idUser);
    
            user.NomeUser = userToUpdate.NomeUser ?? user.NomeUser;
            user.TelUser = userToUpdate.TelUser ?? user.TelUser;
            user.GenUser = userToUpdate.GenUser ?? user.GenUser;
            user.ImgUrlUser = userToUpdate.ImgUrlUser ?? user.ImgUrlUser;
    
            return await this.userRepository.update(user);
        } catch (error) {
            throw error;
        }
    }

    public async password(idUser: number, updatePasswordUserDTO: UpdatePasswordUserDTO): Promise<User> {
        if(!updatePasswordUserDTO?.SenhaUser) throw new Error('Empty password');
        
        let user = await this.userRepository.findByIdWithPassword(idUser);
        const err = await this.validatePassword(user, updatePasswordUserDTO);
        if (err instanceof Error) {
            throw err;
        }
        user.SenhaUser = await bcrypt.hash(updatePasswordUserDTO.SenhaUser.first, 10);
        
        user = await this.userRepository.updatePassword(user);
        return user
    }

    public async image(idUser: number, image: string): Promise<User> {
        let user = await this.userRepository.findById(idUser);

        user.ImgUrlUser = image;
        user = await this.userRepository.updateImage(user);
        return user;
    }

    private async validatePassword(user: User, newUser: UpdatePasswordUserDTO): Promise<Error | null> {
        if(!newUser?.SenhaUser) return null;
        if(newUser.SenhaUser.first !== newUser.SenhaUser.second) 
            return new Error('A senha esta diferente');
    
        const isValidPassword = await bcrypt.compare(newUser.SenhaUser.old, user.SenhaUser);
        if(!isValidPassword) return new Error('Senha antiga invalida');

        return null;
    }
}