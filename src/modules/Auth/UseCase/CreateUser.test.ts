import { CreateUserRequest } from "../DTO/CreateUserRequest"
import User from "../Entities/User"
import IRepository from "../Interfaces/IRepository"
import CreateUser from "./CreateUser"
import bcrypt from "bcrypt"

jest.mock("bcrypt")

describe('Testando CreateUser UseCase', () => {
    let userRepository: jest.Mocked<IRepository>;

    beforeAll(() => {
        userRepository = {
            save: jest.fn(),
            update: jest.fn(),
            findByEmail: jest.fn(),
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

        userRepository.save.mockResolvedValue(userExpected);

        const createUserService = new CreateUser(userRepository);

        const user = await createUserService.execute(userToRegister);

        expect(user).toEqual(userExpected);
        expect(userRepository.save).toHaveBeenCalledWith(expect.objectContaining({
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
