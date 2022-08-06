import { BaseRepository } from "./base/BaseRepository";

// import entities
import { Lot } from "../entities/Lot";

export class LotRepository extends BaseRepository<Lot> {
    countOfLots(): Promise<number> {
        return this._collection.count({});
    }
}