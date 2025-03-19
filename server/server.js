import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import { clerkwebhooks } from './api/webhooks.js';

const app = express();

// Connect to MongoDB
(async () => {
    await connectDB();
})();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send("API is cooking"));
app.post('/webhooks', clerkwebhooks);

export default app; 
