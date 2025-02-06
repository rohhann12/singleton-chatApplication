import express, { Request, Response } from 'express';
import { pubsubManager, userType } from './initializer';

const app = express();
const pubSub = pubsubManager.getInstance();

app.use(express.json());

// Publisher Endpoint (ADMIN only)
app.post('/publish', async (req: Request, res: Response): Promise<any> => {
    const { channel, message, role } = req.body;

    if (role !== userType.ADMIN) {
        return res.status(403).json({ error: 'Only ADMIN can publish' });
    }

    try {
        pubSub.publishHelper(userType.ADMIN, channel, message);
        return res.json({ success: true, message: 'Message published' });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
});


app.get('/subscribe', async (req: Request, res: Response):Promise<any>=> {
    const { channel } = req.query;

    if (!channel) {
        return res.status(400).json({ error: "Channel is required" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const messageHandler = (message: string) => {
        console.log('Received message:', message);
        res.write(`data: ${JSON.stringify({ message })}\n\n`);
    };

    try {
        pubSub.subscribe(channel as string,userType.USER,messageHandler);
        res.write(`data: Subscribed to channel: ${channel}\n\n`);
    } catch (err) {
        console.error("Subscription error:", err);
        res.status(500).json({ error: err || "Internal Server Error" });
    }
});


// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
