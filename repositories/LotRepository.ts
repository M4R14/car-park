import { BaseRepository } from "./base/BaseRepository";

// import entities
import { Lot, ILot } from "../entities/Lot";

export class LotRepository extends BaseRepository<Lot> {
    countOfLots(): Promise<number> {
        return this._collection.count({});
    }

    async findAll(): Promise<Lot[]> {
        const result = await this._collection.find({});

        if (!result) {
            return [];
        }

        return (await result.toArray()).map((lot: ILot) => {
            const _lot = new Lot(lot);

            return _lot;
        });
    }

    async delete(id: string): Promise<boolean> {
        const result = await this._collection.deleteOne({ _id: id });

        return result.deletedCount > 0;
    }
}