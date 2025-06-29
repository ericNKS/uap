import { createClient, RedisClientType } from 'redis';

export default class RedisService {
    private static instance: RedisService;
    private client: RedisClientType;

    private constructor(url?: string) {
        url = url || process.env.REDIS_HOST || 'redis://localhost:6379';
        this.client = createClient({ url });

        this.client.on('error', (err: Error) => {
            console.error('Redis error:', err);
        });
    }

    public static getInstance(url?: string): RedisService {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService(url);
        }
        return RedisService.instance;
    }

    public async connect(): Promise<void> {
        if (!this.client.isOpen) {
            await this.client.connect();
        }
    }

    public async disconnect(): Promise<void> {
        if (this.client.isOpen) {
            await this.client.disconnect();
        }
    }

    public async get(key: string): Promise<string | null> {
        if (!this.client.isOpen) {
            await this.connect();
        }
        return await this.client.get(key);
    }

    public async set(key: string, value: string, expireSeconds?: number): Promise<void> {
        if (!this.client.isOpen) {
            await this.connect();
        }
        if (expireSeconds) {
            await this.client.set(key, value, { EX: expireSeconds });
        } else {
            await this.client.set(key, value);
        }
    }

    public async remove(key: string): Promise<number> {
        if (!this.client.isOpen) {
            await this.connect();
        }
        return await this.client.del(key);
    }
}
