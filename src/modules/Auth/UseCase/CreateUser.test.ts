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
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
    });

    it('Deve registrar um usuario que nao existe', async () => {
        const userToRegister: CreateUserRequest = {
            name: 'Eric',
            email: 'eric@gmail.com',
            password: {
                first: '12345678rb',
                second: '12345678rb'
            }
        };

        const userExpected: User = {
            id: 1,
            name: 'Eric',
            email: 'eric@gmail.com',
            password: 'hashed-password'
        };

        userRepository.save.mockResolvedValue(userExpected);

        const createUserService = new CreateUser(userRepository);

        const user = await createUserService.execute(userToRegister);

        expect(user).toEqual(userExpected);
        expect(userRepository.save).toHaveBeenCalledWith(expect.objectContaining({
            name: 'Eric',
            email: 'eric@gmail.com',
            password: 'hashed-password'
        }));
    });
});
