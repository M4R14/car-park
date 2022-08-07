// importing mongoClient to connect at mongodb
import { MongoClient, Db } from 'mongodb';

// mongo client is a class that we use to connect at mongodb
class Database {
    private url: string = 'mongodb://localhost:27017';
    private databaseName: string = 'warriors';

    private instance: MongoClient;

    private db: Db;

    constructor(url:string, databaseName:string) {
        this.url = url;
        this.databaseName = databaseName;
        this.instance = new MongoClient(this.url);
        this.instance.connect((err: any) => {
            if (err) {
                console.log(err);
                return;
            }
            // console.log('Connected to mongodb');
        });
        this.db = this.instance.db(this.databaseName);
    }

    // get instance 
    async getInstance(): Promise<MongoClient> {
        if (!this.instance) {
            this.instance = await MongoClient.connect(this.url);
            this.db = this.instance.db(this.databaseName);
        }
        return this.instance;
    }

    // get database
    async getDb(): Promise<Db> {
        if (!this.db) {
            this.db = await this.getInstance()
                .then(instance => instance.db(this.databaseName));
        }
        return this.db;
    }

    getDatabase(): Db {
        return this.db;
    }
}

import dotenv from 'dotenv';
dotenv.config();
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'warriors';
const database = new Database(DB_URL, DB_NAME);
export default database;