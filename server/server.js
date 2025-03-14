import './config/instrument.js'
import express from 'express';
import cors from 'cors';
import "dotenv/config";
import connectdb from './config/db.js';
import * as Sentry from "@sentry/node";
import { clerkwebhooks } from './controllers/webhooks.js';


// Initialize express
const app = express();
//connect to database
await connectdb()

// Middleware
app.use(cors());
app.use(express.json());  

// Routes
app.get('/', (req, res) => res.send("API working"));
app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
  });

app.post('/webhooks',clerkwebhooks)
  

// Port
const port = process.env.PORT || 3000;  
Sentry.setupExpressErrorHandler(app);


app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
