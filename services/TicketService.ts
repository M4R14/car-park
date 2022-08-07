import { LotRepository } from '../repositories/LotRepository';
import { TicketRepository } from '../repositories/TicketRepository';

import { Ticket } from '../entities/Ticket';
import { Car } from '../entities/Car';
import { Lot } from '../entities/Lot';

import { Size } from '../enums/Size';

export default class TicketService 
{
    private ticketRepository: TicketRepository;
    private lotRepository: LotRepository;

    constructor(ticketRepository: TicketRepository, lotRepository: LotRepository) {
        this.ticketRepository = ticketRepository;
        this.lotRepository = lotRepository;
    }
}