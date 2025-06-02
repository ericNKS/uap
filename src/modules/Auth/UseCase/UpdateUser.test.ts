import 'reflect-metadata';
import UpdateUserDTO from "../DTO/UpdateUserDTO";
import User from "../Entities/User";
import IUserRepository from "../Interfaces/IUserRepository";
import UpdateUser from "./UpdateUser";
import bcrypt from "bcryptjs"
import UpdatePasswordUserDTO from '../DTO/UpdatePasswordUserDTO';

jest.mock("bcryptjs")

describe('Teste da atualização do usuário', ()=>{
    let userRepository: jest.Mocked<IUserRepository>;
    let updateUser: UpdateUser;
    
    beforeAll(() => {
        userRepository = {
            createPaciente: jest.fn(),
            createEspecialista: jest.fn(),
            update: jest.fn(),
            updateImage: jest.fn(),
            updatePassword: jest.fn(),
            findByEmail: jest.fn(),
            activeByEmail: jest.fn(),
            findByCpfOrCnpjUser: jest.fn(),
            findById: jest.fn(),
            findByIdWithPassword: jest.fn(),
            remove: jest.fn()
        };
        
        updateUser = new UpdateUser(userRepository);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Deve ser feito atualizações basicas', async () => {
        const updateData = new UpdateUserDTO();
        updateData.NomeUser = 'Updated Name';
        updateData.EmailUser = 'updated@example.com';
        
        const mockUser = {
            IdUser: 1,
            NomeUser: 'Old name',
            TelUser: '88988888888',
            GenUser: 'Honda Civic',
            EmailUser: 'teste@gmail.com',
            ImgUrlUser: '',
            SenhaUser: 'hashed-password'
        } as User;
        
        userRepository.findByIdWithPassword.mockResolvedValue(mockUser);
        
        userRepository.update.mockImplementation(async (user) => {
            return {
                ...user,
                NomeUser: updateData.NomeUser || user.NomeUser,
                EmailUser: updateData.EmailUser || user.EmailUser
            } as User;
        });
        
        const result = await updateUser.execute(1, updateData);
        
        expect(result.NomeUser).toBe('Updated Name');
        expect(result.EmailUser).toBe('updated@example.com');
        expect(result.TelUser).toBe('88988888888');
        expect(result.GenUser).toBe('Honda Civic');
        
        expect(userRepository.findByIdWithPassword).toHaveBeenCalledWith(1);
        expect(userRepository.update).toHaveBeenCalled();
    });

    it('Espera erro por causa da senha antiga errada', async () => {
        const updateData = new UpdatePasswordUserDTO();
        updateData.SenhaUser = {
            old: '123',
            first: 'nova-senha',
            second: 'nova-senha'
        };
        
        const mockUser = {
            IdUser: 1,
            NomeUser: 'Old name',
            TelUser: '88988888888',
            GenUser: 'Honda Civic',
            EmailUser: 'teste@gmail.com',
            ImgUrlUser: '',
            SenhaUser: 'hashed-password'
        } as User;
        
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        userRepository.findByIdWithPassword.mockResolvedValue(mockUser);
        
        await expect(updateUser.password(1, updateData)).rejects.toThrow('Senha antiga invalida');

        jest.spyOn(userRepository, 'updatePassword');
        
        expect(userRepository.findByIdWithPassword).toHaveBeenCalledWith(1);
        expect(userRepository.updatePassword).not.toHaveBeenCalled();
    });

    it('Espera atualizar a senha', async () => {
        const updateData = new UpdatePasswordUserDTO();
        updateData.SenhaUser = {
            old: 'hashed-password',
            first: 'nova-senha',
            second: 'nova-senha'
        };
        
        const mockUser = {
            IdUser: 1,
            NomeUser: 'Old name',
            TelUser: '88988888888',
            GenUser: 'Honda Civic',
            EmailUser: 'teste@gmail.com',
            ImgUrlUser: '',
            SenhaUser: 'hashed-password'
        } as User;
        
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        userRepository.findByIdWithPassword.mockResolvedValue(mockUser);

        const userSaved = await updateUser.password(1, updateData)
        
        expect(userSaved.SenhaUser).toEqual('nova-senha');

        jest.spyOn(userRepository, 'updatePassword');
        
        expect(userRepository.findByIdWithPassword).toHaveBeenCalledWith(1);
        expect(userRepository.updatePassword).toHaveBeenCalled();
    });
});