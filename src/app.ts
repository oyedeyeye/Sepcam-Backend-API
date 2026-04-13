import express from 'express';
import cors from 'cors';
import publicRoutes from './routes/publicRoutes';
import adminRoutes from './routes/adminRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Default root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Sepcam API v2' });
});

// Express endpoints
app.use('/', publicRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

export default app;
