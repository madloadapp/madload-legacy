import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import logger from './lib/utils/logger';

const app: express.Application = express();
const PORT: number = process.env.PORT ? +process.env.PORT : 5000;

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(helmet());
app.use(cors());
app.use(compression());

// static files
app.use('/assets', express.static(path.join(__dirname, 'dist')));

// API route
app.use('/api', require('./routes/api'));

// home page
app.get('/', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

// not found (404)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '..', 'client', '404.html'));
});

app.listen(PORT, () => logger('success', `running on: ${PORT}`));
