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
            findByIdWithPassword: jest.fn(),
            remove: jest.fn(),
        };

        // Mock do bcrypt
        (bcrypt.hash as jest.Mock).mockImplementation((password, saltRounds) => {
            return Promise.resolve('hashed-password');
        });
    });

    it('Deve registrar um usuario que nao existe', async () => {
        const userToRegister: CreateUserRequest = {
            NomeUser: 'Eric',
            EmailUser: 'eric@gmail.com',
            SenhaUser: {
                first: '12345678rb',
                second: '12345678rb'
            },
            CpfOrCnpjUser: '24858927091',
            GenUser: 'Honda Civic',
            PronomeUser: 'ele/dele',
            RulesUser: RulesEnum.paciente
        };

        const userExpected: User = {
            IdUser: 1,
            NomeUser: 'Eric',
            EmailUser: 'eric@gmail.com',
            SenhaUser: 'hashed-password',
            CpfOrCnpjUser: '24858927091',
            GenUser: 'Honda Civic',
            RulesUser: 'RULE_PACIENTE',
            StsVerificarEmail: false,
            StsAtivoUser: 's',
        } as User;

        userRepository.createPaciente.mockResolvedValue(userExpected);

        const createUserService = new CreateUser(userRepository);

        const user = await createUserService.paciente(userToRegister);

        expect(user).toEqual(userExpected);
        expect(userRepository.createPaciente).toHaveBeenCalledWith(expect.objectContaining({
            NomeUser: 'Eric',
            EmailUser: 'eric@gmail.com',
            CpfOrCnpjUser: '24858927091',
            GenUser: 'Honda Civic',
            RulesUser: 'RULE_PACIENTE',
            StsVerificarEmail: false,
            StsAtivoUser: 's'
        }));
    });
});
