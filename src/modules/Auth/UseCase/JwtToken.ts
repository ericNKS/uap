import Jwt, { SignOptions } from "jsonwebtoken";
import User from "../Entities/User";

interface UserAuthenticated {
	idUser: number,
	nomeuser: string,
	emailuser: string,
	teluser: string,
	cpforunpjUuser: string | null,
	crpuser: string | null,
	imgurluser: string | null,
	genuser: string,
	rulesuser: string,
	stsativouser: string,
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