import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import JwtToken from "../../modules/Auth/UseCase/JwtToken";
import RedisService from "../database/RedisService";

declare module 'fastify' {
    interface FastifyRequest {
        token: string,
        user?: any,
    }
  }

export default class AuthMiddleware {
    private rules: Array<string> = ['RULE_PACIENTE'];

    constructor(rule: Array<string>) {
        if (rule) {
            this.rules = rule;
        }
    }

    public async authenticate(req: FastifyRequest, reply: FastifyReply) {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return reply.code(401).send({ error: 'Usuario desconectado' });
            }

            const redis = RedisService.getInstance();
            const isRevoked = await redis.get(`token:blacklist:${token}`);

            if (isRevoked) {
                return reply.code(401).send({ error: 'Token expirado' });
            }

            const payload = JwtToken.decode(token);

            if (payload.stsativouser !== 's') {
                return reply.code(403).send({ error: 'Usuario desativado' });
            }

            const currentTime = Math.floor(Date.now() / 1000);
            if (payload.exp && payload.exp < currentTime) {
                return reply.code(401).send({ error: 'Token expirado' });
            }

            const userRule = payload.rulesuser;
            if (!userRule) {
                return reply.code(403).send({ error: 'Regra de usuário não encontrada no token' });
            }

            const userRules = userRule.split(',');
            if (this.rules && this.rules.length > 0) {
                const autorizado = this.rules.some(e => userRules.includes(e));
                if (!autorizado) {
                    return reply.code(401).send({ error: 'Usuario não autorizado' });
                }
            }

            req.user = payload;
            req.token = token;
        } catch (error) {
            req.log.error(error);
            return reply.code(401).send({ error: 'Token inválido' });
        }
    }
}