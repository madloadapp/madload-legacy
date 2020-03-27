import Koa from 'koa';
import Router from 'koa-router';
import json from 'koa-json';
import serve from 'koa-static';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import cors from '@koa/cors';
import * as path from 'path';
import * as logger from './utils/logger';
import APIRouter from './routes/api';

const app = new Koa();
const router = new Router();
const PORT: number = process.env.PORT ? +process.env.PORT : 5000;
const publicDir: string = path.join(__dirname, '..', 'public');

app.use(json());
app.use(bodyParser());
app.use(helmet());
app.use(cors());
app.use(router.routes()).use(router.allowedMethods());

// serve the static files
router.use('/assets', serve(path.join(publicDir, 'assets')));

// API route
router.use('/api', APIRouter);

// static files

// serve /favico .. good for SEO
router.use(
  '/favico.ico',
  serve(path.join(publicDir, 'assets', 'favicons', 'favicon.ico'))
);

// home page
router.get(/.*/, serve(path.join(publicDir, 'index.html')));

app.listen(PORT, () => logger.success(`running on: ${PORT}`));
