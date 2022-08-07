import { BaseRepository } from "./base/BaseRepository";

// import entities
import { Lot, ILot } from "../entities/Lot";

export class LotRepository extends BaseRepository<Lot> {
    countOfLots(): Promise<number> {
        return this._collection.count({});
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

    async findById(id: Object): Promise<Lot|null> {
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

    async delete(id: Object): Promise<boolean> {
        const result = await this._collection.deleteOne({ _id: id });

        return result.deletedCount > 0;
    }
}