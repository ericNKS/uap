import User from "../Entities/User";
import JwtToken from "./JwtToken";
import Jwt from "jsonwebtoken";



describe('Teste a funcao de criar jwt token', ()=> {

    beforeAll(() => {        
        jest.spyOn(Jwt, 'sign').mockImplementation();
        jest.spyOn(Jwt, 'decode').mockImplementation();
    });

    afterAll(() => {
        jest.spyOn(Jwt, 'sign').mockImplementation();
        jest.spyOn(Jwt, 'decode').mockImplementation();
    });

    beforeEach(() => {
        (Jwt.sign as jest.Mock).mockReset();
        (Jwt.decode as jest.Mock).mockReset();
    });

    it('Testando geracao do token', ()=>{
        const token = 'valid.jwt.token';
        (Jwt.sign as jest.Mock).mockReturnValue(token);

        const user = new User();

        expect(JwtToken.generate(user)).toEqual(token)
        expect(Jwt.sign).toHaveBeenCalled();
    });

    it('Testando decodificao do token', ()=>{
        const token = 'valid.jwt.token';
        (Jwt.decode as jest.Mock).mockReturnValue({
            idUser: 1,
            nomeuser: 'Teste'
        });

        const result = JwtToken.decode(token);

        expect(Jwt.decode).toHaveBeenCalledWith(token);

        expect(result).toHaveProperty('idUser');
    });
})