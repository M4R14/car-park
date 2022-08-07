import { TicketRepository } from '../repositories/TicketRepository';
import { Router, Request, Response, NextFunction } from 'express';
import { Ticket } from '../entities/Ticket';

class TicketController 
{
    private ticketRepository: TicketRepository;

    constructor(ticketRepository: TicketRepository) {
        this.ticketRepository = ticketRepository;

        this.index = this.index.bind(this);
    }

    async index(req: Request, res: Response, next: NextFunction) : Promise<void> {
        const tickets = await this.ticketRepository.findAll();
        res.json(tickets);
    }
}

export default TicketController;