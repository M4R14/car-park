import { BaseRepository } from "./base/BaseRepository";

// import entities
import { Ticket } from "../entities/Ticket";

export class TicketRepository extends BaseRepository<Ticket> {
    countOfTickets(): Promise<number> {
        return this._collection.count({});
    }
}