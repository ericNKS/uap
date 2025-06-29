import Jwt, { SignOptions } from "jsonwebtoken";
import User from "../Entities/User";

interface UserAuthenticated {
	IdUser: number,
	NomeUser: string,
	EmailUser: string,
	TelUser: string,
	CpfOrCnpjUser: string | null,
	CrpUser: string | null,
	ImgUrlUser: string | null,
	GenUser: string,
	PronomeUser: string,
	RulesUser: string,
    StsVerificarEmail: boolean,
	StsAtivoUser: string,
	iat: number,
	exp: number
}

export default class JwtToken {
    private static secret: string = process.env.APP_SECRET || 'W5qmUbR4gc9ecqBe8NU6RBScojSmvP';

    public static generate(
        payload: User,
        options?: SignOptions
    ): string {
        const defaultOptions: SignOptions = { expiresIn: '24h' };
        
        return Jwt.sign(payload, this.secret, options || defaultOptions);
    }

    public static decode(token: string): UserAuthenticated {
        const result = Jwt.decode(token);
        
        return result as UserAuthenticated
    }
}