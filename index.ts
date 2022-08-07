import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import routeWeb from './routes/web';
dotenv.config();

const app: Express = express();
const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || '0.0.0.0';

app.use(express.json());

app.use('/', routeWeb);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, host, () => {
  console.log(`⚡️[server]: Server is running at https://${host}:${port}`);
});

