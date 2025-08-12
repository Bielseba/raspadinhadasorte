import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler, notFoundHandler } from '../middlewares/errorMiddleware';
import { createRoutes } from '../routes/index';
import { Container } from './container';
import path from 'path';

export const createApp = (container: Container): Application => {
  const app = express();

  // Middlewares de segurança
  app.use(helmet());

  // CORS
  app.use(cors({
    origin: process.env.CORS_ORIGIN || ['http://localhost:5500', 'http://127.0.0.1:5500'],
    credentials: true
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutos
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limite de requisições
    message: {
      error: 'Muitas requisições deste IP, tente novamente em alguns minutos.'
    }
  });
  app.use(limiter);

  // Middlewares para parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Middleware para servir arquivos estáticos (imagens)
  app.use('/uploads', express.static('../images'));

  // Rotas da API
  app.use('/api', createRoutes(container));

  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname,'..', '..', '..','public', 'index.html'));
  });

  app.get('/admin', (req, res) => {
    res.sendFile(path.resolve(__dirname,'..', '..', '..', 'public', 'admin', 'index.html'));
  });

  app.use(express.static(path.resolve(__dirname, '..', '..', '..','public')));
  app.use('/admin', express.static(path.resolve(__dirname, '..', '..', '..','public', 'admin')));

  // Middlewares de tratamento de erro (devem ser os últimos)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}; 