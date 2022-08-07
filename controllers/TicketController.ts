import { TicketRepository } from '../repositories/TicketRepository';
import { Router, Request, Response, NextFunction } from 'express';
import { Ticket } from '../entities/Ticket';
import { Size } from '../enums/Size';

class TicketController 
{
    private ticketRepository: TicketRepository;

    constructor(ticketRepository: TicketRepository) {
        this.ticketRepository = ticketRepository;

        this.index = this.index.bind(this);
        this.getAllPlateNumber = this.getAllPlateNumber.bind(this);
    }

    async index(req: Request, res: Response, next: NextFunction) : Promise<void> {
        let tickets = await this.ticketRepository.findAll();

        // if params has car size, filter tickets by size
        if (req.query.size) {
            const size = Number(req.query.size);

            // size in Size enum
            if (size in Size) {
                tickets = tickets.filter(ticket => Size[ticket.getSize()] === Size[size]);
            }
        }

        res.json(tickets);
    }

    async getAllPlateNumber(req: Request, res: Response, next: NextFunction) : Promise<void> {
        let tickets : Ticket[] = await this.ticketRepository.findAll();

        // if params has car size, filter tickets by size
        if (req.query.size) {
            const size = Number(req.query.size);

            // size in Size enum
            if (size in Size) {
                tickets = tickets.filter(ticket => Size[ticket.getSize()] === Size[size]);
            }
        }

        const plateNumbers = tickets.map(ticket => ticket.getPlateNumber());

        res.json(plateNumbers);
    }
}

export default TicketController;