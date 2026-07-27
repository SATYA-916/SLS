import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import session from 'express-session';
import router from './routes/index.js';
import { logger } from './lib/logger.js';

const app = express();

const isProd = process.env.NODE_ENV === 'production';
if (isProd) {
  app.set('trust proxy', 1);
}

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split('?')[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  })
);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET ?? 'sls-fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 8,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
    },
  })
);

app.use('/api', router);

export default app;
