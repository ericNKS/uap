import { CreateUserRequest } from "../DTO/CreateUserRequest"
import User from "../Entities/User"
import IUserRepository from "../Interfaces/IUserRepository"
import { RulesEnum } from "../Utils/RulesEnum"
import CreateUser from "./CreateUser"
import bcrypt from "bcryptjs"

jest.mock("bcryptjs")

describe('Testando criação do paciente', () => {
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

        // Mock do bcrypt
        (bcrypt.hash as jest.Mock).mockImplementation((password, saltRounds) => {
            return Promise.resolve('hashed-password');
        });
    });

    it('Deve registrar um usuario que nao existe', async () => {
        const userToRegister: CreateUserRequest = {
            nomeUser: 'Eric',
            emailUser: 'eric@gmail.com',
            senhaUser: {
                first: '12345678rb',
                second: '12345678rb'
            },
            cpfOrCnpjUser: '24858927091',
            genUser: 'Honda Civic',
            userType: RulesEnum.paciente
        };

        const userExpected: User = {
            idUser: 1,
            nomeuser: 'Eric',
            emailuser: 'eric@gmail.com',
            senhauser: 'hashed-password',
            cpforcnpjuser: '24858927091',
            genuser: 'Honda Civic',
            rulesuser: 'RULE_USER',
            stsativouser: 'n',
        } as User;

        userRepository.createPaciente.mockResolvedValue(userExpected);

        const createUserService = new CreateUser(userRepository);

        const user = await createUserService.paciente(userToRegister);

        expect(user).toEqual(userExpected);
        expect(userRepository.createPaciente).toHaveBeenCalledWith(expect.objectContaining({
            nomeuser: 'Eric',
            emailuser: 'eric@gmail.com',
            senhauser: 'hashed-password',
            cpforcnpjuser: '24858927091',
            genuser: 'Honda Civic',
            rulesuser: 'RULE_USER',
            stsativouser: 'n'
        }));
    });
});
