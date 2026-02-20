import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import txRoutes from './routes/transactions.routes.js';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*' }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req,res)=>res.json({status:'ok'}));
app.use('/api/users', authRoutes);
app.use('/api/transactions', txRoutes);

export default app;