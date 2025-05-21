import { createClient, RedisClientType } from 'redis';

export default class RedisService {
    private static instance: RedisService;
    private client: RedisClientType;
    private isConnected: boolean = false;

    private constructor(url?: string) {
        url = url || process.env.REDIS_HOST || 'redis://localhost:6379';
        this.client = createClient({ url });

        this.client.on('error', (err: Error) => {
            console.error('Redis error:', err);
            this.isConnected = false;
        });

        this.client.on('connect', () => {
            console.log('Redis connected');
            this.isConnected = true;
        });
    }

    // Singleton: garante uma única instância do RedisService
    public static getInstance(url?: string): RedisService {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService(url);
        }
        return RedisService.instance;
    }

    // Conecta ao Redis (chame uma vez ao iniciar a aplicação)
    public async connect(): Promise<void> {
        if (!this.isConnected) {
            await this.client.connect();
            this.isConnected = true;
        }
    }

    // Desconecta do Redis (chame ao encerrar a aplicação)
    public async disconnect(): Promise<void> {
        if (this.isConnected) {
            await this.client.disconnect();
            this.isConnected = false;
        }
    }

    public async get(key: string): Promise<string | null> {
        if (!this.isConnected) {
            await this.connect();
        }
        return await this.client.get(key);
    }

    public async set(key: string, value: string, expireSeconds?: number): Promise<void> {
        if (!this.isConnected) {
            await this.connect();
        }
        if (expireSeconds) {
            await this.client.set(key, value, { EX: expireSeconds });
        } else {
            await this.client.set(key, value);
        }
    }
}