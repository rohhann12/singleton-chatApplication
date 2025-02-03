import { createClient, RedisClientType } from 'redis';

interface Stock {
    Price: Number[];
    Name: String;
    closedAt: Number;
    openedAt: Number;
}

export enum userType {
    USER,
    ADMIN
}

export class pubsubManager {
    private stock: Stock[] = [];
    static instance: pubsubManager;

    private subscriber: RedisClientType;
    private publisher: RedisClientType;

    private constructor() {
        this.stock = [];
        this.subscriber = createClient({
            url: "redis://localhost:6379"

        });
        this.publisher = createClient({
            url: "redis://localhost:6379"

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

    public subscribe(stockNames: string[], role: userType) {
        if (role !== userType.USER) {
            return "Role not verified to subscribe";
        }
    
        const messageHandler = (message: string) => {
            try {
                const stock: Stock[] = JSON.parse(message);
                console.log('Received stock update:', stock);
            } catch (err) {
                console.error('Error parsing message:', err);
            }
        };

        stockNames.forEach(stockName => {
            this.subscriber.subscribe(stockName, messageHandler).catch((err) => {
                console.error(`Error subscribing to ${stockName}:`, err);
            });
        });
    }
    
    public publishHelper(role: userType, stockName: string, stockData: Stock[]) {
        if (role !== userType.ADMIN) {
            return "Role not verified to publish";
        }
        this.publisher.publish(stockName, JSON.stringify(stockData));  
        console.log(`Publishing stock updates for stock ${stockName}`);
    }
    
    
}
