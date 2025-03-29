import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import CompanyRoutes from './routes/CompanyRoutes.js'; // Ensure correct import case
import connectDB from './config/db.js';
import { clerkwebhooks } from './controllers/Webhooks.js'; // Ensure correct path
import Jobroutes from './routes/Jobroutes.js'
import Userroutes from './routes/Userroutes.js'
import { clerkMiddleware } from '@clerk/express'


dotenv.config();


connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())

// Simple GET route to confirm the server is running
app.get('/', (req, res) => res.send("API is running on http://localhost:5000"));

// POST route for Clerk webhooks
app.post('/webhooks', clerkwebhooks);

// Use company routes
app.use('/api/company', CompanyRoutes);
app.use('/api/jobs',Jobroutes)
app.use('/api/user',Userroutes)//creation of endpoints

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
