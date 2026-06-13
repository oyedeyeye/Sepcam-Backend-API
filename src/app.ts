import express from 'express';
import cors from 'cors';
import publicRoutes from './routes/publicRoutes';
import adminRoutes from './routes/adminRoutes';
import userRoutes from './routes/userRoutes';
import contactRoutes from './routes/contact.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json';
import { globalErrorHandler } from './middlewares/errorHandler';

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
app.use('/api/contact', contactRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Global Error Handler should be mounted last
app.use(globalErrorHandler as any);

export default app;
