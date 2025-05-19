import { createClient, RedisClientType } from "redis";

export default class RedisService {
    private client: RedisClientType;
    private isConnected: boolean = false;

    constructor(
        url?: string
    ) {
        url = url || process.env.REDIS_HOST || 'redis://localhost:6379';

        this.client = createClient({url});

        this.client.on('error', (err: Error) => {
            console.error('Redis Client Error:', err);
            this.isConnected = false;
          });
          
          this.client.on('connect', () => {
            this.isConnected = true;
            console.log('Redis client connected');
          });
    }

    private async connect(): Promise<void> {
        if (this.isConnected) {
            return;
        }
        await this.client.connect();
        this.isConnected = true;
    }

    private async disconnect(): Promise<void> {
        if (!this.isConnected) {
            return;
        }
        await this.client.close();
        this.isConnected = false;
    }

    async get(key: string): Promise<string | null> {
        await this.connect();
        const result = await this.client.get(key);
        await this.disconnect();

        return result;
    }

    async set(key: string, value: string, expireSeconds?: number): Promise<void> {
        await this.connect();
        
        if (expireSeconds) {
            await this.client.set(key, value, { EX: expireSeconds });
            await this.disconnect();
            
            return;
        }
        
        await this.client.set(key, value);
        await this.disconnect();
    }
}