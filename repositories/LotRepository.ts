import { BaseRepository } from "./base/BaseRepository";

// import entities
import { Lot, ILot } from "../entities/Lot";
import { ObjectId } from "mongodb";


export class LotRepository extends BaseRepository<Lot> {
    countOfLots(): Promise<number> {
        return this._collection.count({});
    }

    async findByNumber(number: number): Promise<Lot|null> {
        const result = await this._collection.findOne({ number: number });

        if (!result) {
            return null;
        }

        return new Lot({
            _id: result._id,
            number: result.number,
            size: result.size,
            isUsed: result.isUsed,
            distance: result.distance,
        });
    }

    async findByIds(ids: Object[]|string[]): Promise<Lot[]> {
        const objectIds = ids.map(id => {
            if (typeof id === "string") {
                return new ObjectId(id);
            }
            return id;
        });

        const result = await this._collection.find({ _id: { $in: objectIds } });
        return (await result.toArray()).map(lot => new Lot({
            _id: lot._id,
            number: lot.number,
            size: lot.size,
            distance: lot.distance,
            isUsed: lot.isUsed,
        }));
    }

    async all(): Promise<Lot[]> {
        const result = await this._collection.find({});
        return (await result.toArray()).map(lot => {
            return new Lot({
                _id: lot._id,
                number: lot.number,
                size: lot.size,
                isUsed: lot.isUsed,
                distance: lot.distance,
            });
        });
    }

    async findById(id: Object|string): Promise<Lot|null> {
        if (typeof id === "string") {
            id = new ObjectId(id);
        }

        const result = await this._collection.findOne({ _id: id });

        if (!result) {
            return null;
        }

        return new Lot({
            _id: result._id,
            number: result.number,
            size: result.size,
            isUsed: result.isUsed,
            distance: result.distance,
        });
    }

    async findAll(): Promise<Lot[]> {
        const result = await this._collection.find({});

        if (!result) {
            return [];
        }

        return (await result.toArray()).map(lot => new Lot({
            _id: lot._id,
            number: lot.number,
            size: lot.size,
            isUsed: lot.isUsed,
            distance: lot.distance,
        }));
    }

    async delete(id: Object|string): Promise<boolean> {
        if (typeof id === "string") {
            id = new ObjectId(id);
        }

        const result = await this._collection.deleteOne({ _id: id });
        console.log(result);
        return result.acknowledged;
    }
}