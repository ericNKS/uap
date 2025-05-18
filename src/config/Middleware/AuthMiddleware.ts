import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import JwtToken from "../../modules/Auth/UseCase/JwtToken";

export default class AuthMiddleware {
    private rules: Array<string> = ['RULE_PACIENTE'];
    constructor(
        rule: Array<string>
    ){
        if(rule) {
            this.rules = rule
        };
    }

    public authenticate(
        req: FastifyRequest,
        reply: FastifyReply,
        next: HookHandlerDoneFunction
    ){
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if(!token) {
                return reply.code(401).send({
                    error: 'Usuario desconectado'
                });
            }
            
            const payload = JwtToken.decode(token);

            if(payload.stsativouser !== 's') return reply.code(403).send({ error: 'Usuario desativado' });
            
            const currentTime = Math.floor(Date.now() / 1000);
            if (payload.exp && payload.exp < currentTime) {
                return reply.code(401).send({ error: 'Token expirado' });
            }

            const userRule = payload.rulesuser
            if (!userRule) {
                return reply.code(403).send({ error: 'Regra de usuário não encontrada no token' });
            }

            const userRules = userRule.split(',');
            if(!this.rules) {
                return next();
            }

            const autorizado = this.rules.some(e => userRules.includes(e));


            if(!autorizado) {
                return reply.code(401).send({
                    error: 'Usuario não autorizado'
                })
            }

            next();
        } catch (error) {
            console.log(error);
            return reply.code(401).send({ error: 'Token inválido' });
        }
    }
}