import './config/instrument.js';
import express from 'express';
import cors from 'cors';
import "dotenv/config";
import connectdb from './config/db.js';
import * as Sentry from "@sentry/node";
import { clerkwebhooks } from './controllers/webhooks.js';

// Initialize express
const app = express();

// Connect to database inside an async function
(async () => {
    try {
        await connectdb();
        console.log("✅ Database connected successfully");
    } catch (error) {
        console.error("❌ Database connection error:", error);
    }
})();

// Middleware
app.use(cors());
app.use(express.json());  

// Routes
app.get('/', (req, res) => res.send("API working"));

// app.post('/webhooks', clerkwebhooks);

// Set up Sentry
Sentry.setupExpressErrorHandler(app);

// Export app for Vercel (DO NOT use app.listen)
export default app;
