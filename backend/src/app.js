import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandlers.js';

const app = express();
export const prisma = new PrismaClient();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/track', analyticsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
