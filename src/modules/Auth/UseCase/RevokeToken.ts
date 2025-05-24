import RedisService from "../../../config/database/RedisService";
import JwtToken from "./JwtToken";

export default class RevokeToken {
    private readonly BLACKLIST_PREFIX = 'token:blacklist:';
    constructor(
        private redis: RedisService
    ) {}

    public async execute(token: string) {
        try {
            const decoded = JwtToken.decode(token);
            
            const expiryTime = decoded.exp;
            if (!expiryTime) throw new Error('Token has no expiration');
            
            const now = Math.floor(Date.now() / 1000);
            const timeToLive = Math.max(expiryTime - now, 0);
            
            await this.redis.set(
              `${this.BLACKLIST_PREFIX}${token}`, 
              'revoked',
              timeToLive
            );
          } catch (error) {
            throw error;
          }
    }
}