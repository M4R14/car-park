import { BaseRepository } from "./base/BaseRepository";

// import entities
import { Ticket, ITicket } from "../entities/Ticket";
import { ObjectId } from "mongodb";

export class TicketRepository extends BaseRepository<Ticket> {
    countOfTickets(): Promise<number> {
        return this._collection.count({});
    }

    async findByPlateNumber(plateNumber: string): Promise<Ticket|null> {
        const result = await this._collection.findOne({ plateNumber: plateNumber });

        if(!result) {
            return null;
        }

        return new Ticket({
            _id: result._id,
            plateNumber: result.plateNumber,
            size: result.size,
            lot_id: result.lot_id,
            time_start: result.time_start,
            time_end: result.time_end,
        });
    }

    // find all tickets by plateNumber
    async findAllByPlateNumber(plateNumber: string): Promise<Ticket[]> {
        const result = await this._collection.find({ plateNumber: plateNumber }).toArray();
        return result.map(ticket => new Ticket({
            _id: ticket._id,
            plateNumber: ticket.plateNumber,
            size: ticket.size,
            lot_id: ticket.lot_id,
            time_start: ticket.time_start,
            time_end: ticket.time_end,
        }));
    }

    async findById(id: Object|string): Promise<Ticket|null> {
        if (typeof id === "string") {
            id = new ObjectId(id);
        }
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