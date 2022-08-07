// import all interfaces
import { IWrite } from "../interfaces/IWrite";
import { IRead } from "../interfaces/IRead";

// we imported all types from mongodb driver, to use in code
import { 
    MongoClient, Db, Collection,  
} from 'mongodb';

export abstract class BaseRepository<T> implements IWrite<T>, IRead<T>
{
    //creating a property to use your code in all instances 
    // that extends your base repository and reuse on methods of class
    public readonly _collection: Collection;

    //we created constructor with arguments to manipulate mongodb operations
    constructor(db: Db, collectionName: string) {
        this._collection = db.collection(collectionName);
    }

    async empty(): Promise<boolean> {
        const result = await this._collection.deleteMany({});
        return result.acknowledged;
    }

    async create(item: T): Promise<boolean> {
        const result = await this._collection.insertOne(item);
        return result.acknowledged;
    }

    async createMany(items: T[]): Promise<boolean> {
        const result = await this._collection.insertMany(items);
        return result.acknowledged;
    }

    async update(id: Object, item: T): Promise<boolean> {
        const result = await this._collection.updateOne({_id: id}, {$set: item});
        return result.acknowledged;        
    }

    async delete(id: Object): Promise<boolean> {
        const result = await this._collection.deleteOne({_id: id});
        return result.acknowledged;
    }

    async find(item: T): Promise<T[]> {
       throw new Error("Method not implemented.");
    }

    async findOne(id: Object): Promise<T> {
        throw new Error("Method not implemented.");
    }

    async findAll(): Promise<T[]> {
       throw new Error("Method not implemented.");
    }

    
}