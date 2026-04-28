import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import extractRouter from './routes/extract.js';
import { errorHandler } from './middleware/errorHandler.js';



dotenv.config();

console.log('Gemini key loaded:', process.env.GEMINI_API_KEY ? 'YES' : 'NO');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/extract', extractRouter);
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use(errorHandler);

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);