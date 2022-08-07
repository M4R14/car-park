import { BaseRepository } from "./base/BaseRepository";

// import entities
import { Ticket, ITicket } from "../entities/Ticket";

export class TicketRepository extends BaseRepository<Ticket> {
    countOfTickets(): Promise<number> {
        return this._collection.count({});
    }

    async findById(id: Object): Promise<Ticket|null> {
        const result = await this._collection.findOne({ _id: id });
        return result ? new Ticket({
            _id: result._id,
            plateNumber: result.plateNumber,
            size: result.size,
            lot_id: result.lot_id,
            time_start: result.time_start,
            time_end: result.time_end,
        }) : null;
    }

    async findAll(): Promise<Ticket[]> {
        const result = await this._collection.find({}).toArray();

        const items = result
            .map(item => ({
                _id: item._id,
                plateNumber: item.plateNumber,
                size: item.size,
                lot_id: item.lot_id,
                time_start: item.time_start,
                time_end: item.time_end,
            }))
            .map((item:ITicket)  => new Ticket(item));

        return items;
    }
}