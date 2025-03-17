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

// Clerk requires raw body for verification (must come before express.json())
app.use("/webhooks", express.raw({ type: "application/json" }));

// Other JSON parsing middleware (for non-webhook routes)
app.use(express.json());  

// Routes
app.get('/', (req, res) => res.send("API working"));

// Webhook route
app.post('/webhooks', clerkwebhooks);

Sentry.setupExpressErrorHandler(app);

export default app;
