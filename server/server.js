import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import { clerkwebhooks } from './api/webhooks.js';

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB (only once)
let isConnected = false;
async function connect() {
    if (!isConnected) {
        await connectDB();
        isConnected = true;
    }
}

app.get('/', (req, res) => res.send("API is cooking"));

app.post('/webhooks', async (req, res) => {
    await connect();
    await clerkwebhooks(req, res);
});


export default app;
