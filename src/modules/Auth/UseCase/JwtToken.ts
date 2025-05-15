import Jwt, { SignOptions } from "jsonwebtoken";
import User from "../Entities/User";

export default class JwtToken {
    private static secret: string = process.env.APP_SECRET || 'W5qmUbR4gc9ecqBe8NU6RBScojSmvP';

    public static generate(
        payload: User,
        options?: SignOptions
    ): string {
        const defaultOptions: SignOptions = { expiresIn: '24h' };
        
        return Jwt.sign(payload, this.secret, options || defaultOptions);
    }

    public static decode(token: string): object | null | string {
        return Jwt.decode(token);
    }
}