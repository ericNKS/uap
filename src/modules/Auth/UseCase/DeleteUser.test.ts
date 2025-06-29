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
            updateImage: jest.fn(),
            updatePassword: jest.fn(),
            activeByEmail: jest.fn(),
            findByEmail: jest.fn(),
            findByCpfOrCnpjUser: jest.fn(),
            findById: jest.fn(),
            findByIdWithPassword: jest.fn(),
            remove: jest.fn(),
        };
    });

    it('O usuario existente tem que ficar com o status = n', async () => {
        const user: User = {
            IdUser: 1,
            NomeUser: 'Eric',
            EmailUser: 'eric@gmail.com',
            CpfOrCnpjUser: '24858927091',
            GenUser: 'Honda Civic',
            RulesUser: 'RULE_USER',
            StsAtivoUser: 's',
        } as User;

        userRepository.findById.mockResolvedValue(user);
        
        userRepository.remove.mockResolvedValue();

        const deleteUserService = new DeleteUser(userRepository);

        if(!user.IdUser) return;

        await expect(deleteUserService.execute(user.IdUser)).resolves.not.toThrow();

        expect(userRepository.remove).toHaveBeenCalled()
    });
});