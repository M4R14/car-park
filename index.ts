import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;


// importing mongoClient to connect at mongodb
import { MongoClient } from 'mongodb';

import { LotRepository } from './repositories/LotRepository';
import { Lot } from './entities/Lot';

(async () => {
  // connecting at mongoClient
  const connection = await MongoClient.connect('mongodb://localhost');
  const db = connection.db('warriors');

  // creating a new instance of LotRepository
  const lotRepository = new LotRepository(db, 'lots');

  // creating a new lot
  const lot = new Lot('1', 1);

  const result = await lotRepository.create(lot);
  console.log(result);

  const count = await lotRepository.countOfLots();
  console.log(`the count of spartans is ${count}`)
})();

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});