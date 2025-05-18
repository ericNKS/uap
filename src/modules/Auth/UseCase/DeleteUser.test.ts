import User from "../Entities/User";
import IUserRepository from "../Interfaces/IUserRepository";
import DeleteUser from "./DeleteUser";

describe('Removendo usuario', () => {
    let userRepository: jest.Mocked<IUserRepository>;

    beforeAll(() => {
        userRepository = {
            createPaciente: jest.fn(),
            createEspecialista: jest.fn(),
            update: jest.fn(),
            findByEmail: jest.fn(),
            findByCpfOrCnpjUser: jest.fn(),
            findById: jest.fn(),
            remove: jest.fn(),
        };
    });

    it('O usuario existente tem que ficar com o status = n', async () => {
        const user: User = {
            idUser: 1,
            nomeuser: 'Eric',
            emailuser: 'eric@gmail.com',
            cpforcnpjuser: '24858927091',
            genuser: 'Honda Civic',
            rulesuser: 'RULE_USER',
            stsativouser: 's',
        } as User;

        userRepository.findById.mockResolvedValue(user);
        
        userRepository.remove.mockResolvedValue();

        const deleteUserService = new DeleteUser(userRepository);

        if(!user.idUser) return;

        await expect(deleteUserService.execute(user.idUser)).resolves.not.toThrow();

        expect(userRepository.remove).toHaveBeenCalled()
    });
});