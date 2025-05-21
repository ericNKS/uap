import 'reflect-metadata';
import UpdateUserDTO from "../DTO/UpdateUserDTO";
import User from "../Entities/User";
import IUserRepository from "../Interfaces/IUserRepository";
import UpdateUser from "./UpdateUser";
import bcrypt from "bcryptjs"

jest.mock("bcryptjs")

describe('Teste da atualização do usuário', ()=>{
    let userRepository: jest.Mocked<IUserRepository>;
    let updateUser: UpdateUser;
    
    beforeAll(() => {
        userRepository = {
            createPaciente: jest.fn(),
            createEspecialista: jest.fn(),
            update: jest.fn(),
            findByEmail: jest.fn(),
            findByCpfOrCnpjUser: jest.fn(),
            findById: jest.fn(),
            findByIdWithPassword: jest.fn(),
            remove: jest.fn(),
        };
        
        updateUser = new UpdateUser(userRepository);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Deve ser feito atualizações basicas', async () => {
        const updateData = new UpdateUserDTO();
        updateData.nomeuser = 'Updated Name';
        updateData.emailuser = 'updated@example.com';
        
        const mockUser = {
            idUser: 1,
            nomeuser: 'Old name',
            teluser: '88988888888',
            genuser: 'Honda Civic',
            emailuser: 'teste@gmail.com',
            imgurluser: '',
            senhauser: 'hashed-password'
        } as User;
        
        userRepository.findByIdWithPassword.mockResolvedValue(mockUser);
        
        userRepository.update.mockImplementation(async (user) => {
            return {
                ...user,
                nomeuser: updateData.nomeuser || user.nomeuser,
                emailuser: updateData.emailuser || user.emailuser
            } as User;
        });
        
        const result = await updateUser.execute(1, updateData);
        
        expect(result.nomeuser).toBe('Updated Name');
        expect(result.emailuser).toBe('updated@example.com');
        expect(result.teluser).toBe('88988888888');
        expect(result.genuser).toBe('Honda Civic');
        
        expect(userRepository.findByIdWithPassword).toHaveBeenCalledWith(1);
        expect(userRepository.update).toHaveBeenCalled();
    });

    it('Espera erro por causa da senha antiga errada', async () => {
        const updateData = new UpdateUserDTO();
        updateData.nomeuser = 'Updated Name';
        updateData.emailuser = 'updated@example.com';
        updateData.senhaUser = {
            old: '123',
            first: 'nova-senha',
            second: 'nova-senha'
        };
        
        const mockUser = {
            idUser: 1,
            nomeuser: 'Old name',
            teluser: '88988888888',
            genuser: 'Honda Civic',
            emailuser: 'teste@gmail.com',
            imgurluser: '',
            senhauser: 'hashed-password'
        } as User;
        
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        userRepository.findByIdWithPassword.mockResolvedValue(mockUser);
        
        await expect(updateUser.execute(1, updateData)).rejects.toThrow('Senha antiga invalida');

        const updateSpy = jest.spyOn(userRepository, 'update');
        
        expect(userRepository.findByIdWithPassword).toHaveBeenCalledWith(1);
        expect(userRepository.update).not.toHaveBeenCalled();
    });
});