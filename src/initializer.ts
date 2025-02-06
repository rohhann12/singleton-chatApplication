import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

export enum userType {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

export class pubsubManager {
    static instance: pubsubManager;

    private subscriber: RedisClientType;
    private publisher: RedisClientType;

    private constructor() {
        const redisHostname = process.env.REDIS_HOSTNAME || 'localhost';
        const redisPort = process.env.REDIS_PORT || '6379';
        const redisPassword = process.env.REDIS_PASSWORD || '';

        this.subscriber = createClient({
            socket: {
                host: redisHostname,
                port: parseInt(redisPort),
            },
            password: redisPassword,
        });
        this.publisher = createClient({
            socket: {
                host: redisHostname,
                port: parseInt(redisPort),
            },
            password: redisPassword,
        });
    }

    public init() {
        this.publisher.connect();
        this.subscriber.connect();
    }

    public static getInstance(): pubsubManager {
        if (!pubsubManager.instance) {
            pubsubManager.instance = new pubsubManager();
            pubsubManager.instance.init();
        }
        return pubsubManager.instance;
    }

    public subscribe(channel: string, role: userType, messageHandler: (message: string) => void) {
        this.subscriber.subscribe(channel, messageHandler).catch((err) => {
            console.error(`Error subscribing to ${channel}:`, err);
        });
    }

    public publishHelper(role: userType, channel: string, message: string) {
        if (role !== userType.ADMIN) {
            throw new Error('Only ADMIN can publish messages');
        }
        this.publisher.publish(channel, message);
        console.log(`Published message to ${channel}`);
    }
}
