import RedisService from "../../../config/database/RedisService";
import JwtToken from "./JwtToken";
import RevokeToken from "./RevokeToken";

describe('RevokeToken Service', () => {
    let redisService: jest.Mocked<RedisService>;
    let revokeTokenService: RevokeToken;
    
    const mockNow = 500;
    const originalDateNow = Date.now;

    beforeAll(() => {
        Date.now = jest.fn(() => mockNow * 1000);
        
        jest.spyOn(JwtToken, 'decode').mockImplementation();
    });

    afterAll(() => {
        Date.now = originalDateNow;

        jest.spyOn(JwtToken, 'decode').mockImplementation();
    });

    beforeEach(() => {
        redisService = {
            set: jest.fn(),
            get: jest.fn(),
            delete: jest.fn(),
            connect: jest.fn(),
            disconnect: jest.fn(),
        } as unknown as jest.Mocked<RedisService>;

        (JwtToken.decode as jest.Mock).mockReset();

        revokeTokenService = new RevokeToken(
            redisService
        );
    });

    it('should successfully revoke a valid token', async () => {
        // Arrange
        const token = 'valid.jwt.token';
        const mockExpiry = 1000;
        const expectedTTL = mockExpiry - mockNow;

        (JwtToken.decode as jest.Mock).mockReturnValue({ 
            exp: mockExpiry, 
            idUser: 123,
            nomeuser: 'Test User',
        });
        
        redisService.set.mockResolvedValue(undefined);

        await revokeTokenService.execute(token);

        expect(JwtToken.decode).toHaveBeenCalledWith(token);
        expect(redisService.set).toHaveBeenCalledWith(
            expect.stringContaining(token),
            'revoked',
            expectedTTL
        );
    });

    it('should throw error when token has no expiration', async () => {
        const token = 'invalid.jwt.token';
        (JwtToken.decode as jest.Mock).mockReturnValue({ 
            idUser: 123,
        });

        await expect(revokeTokenService.execute(token))
            .rejects
            .toThrow('Token has no expiration');
        
        await expect(redisService.set).not.toHaveBeenCalled();
    });

    it('should handle Redis errors gracefully', async () => {
        const token = 'valid.jwt.token';
        (JwtToken.decode as jest.Mock).mockReturnValue({ 
            exp: 1000, 
            idUser: 123,
            nomeuser: 'Test User',
        });
        
        redisService.set.mockRejectedValue(new Error('Redis connection error'));

        await expect(revokeTokenService.execute(token))
            .rejects
            .toThrow('Redis connection error');
    });

    it('should handle expired tokens correctly', async () => {
        const token = 'expired.jwt.token';
        const pastExpiry = mockNow - 100;
        
        (JwtToken.decode as jest.Mock).mockReturnValue({ 
            exp: pastExpiry, 
            idUser: 123,
            nomeuser: 'Test User',
        });
        
        redisService.set.mockResolvedValue(undefined);

        await revokeTokenService.execute(token);

        expect(redisService.set).toHaveBeenCalledWith(
            expect.stringContaining(token),
            'revoked',
            0
        );
    });
});