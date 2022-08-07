import { LotRepository } from '../repositories/LotRepository';
import { TicketRepository } from '../repositories/TicketRepository';
import connection from '../connection';

import { Ticket } from '../entities/Ticket';
import { Car } from '../entities/Car';
import { Lot } from '../entities/Lot';
import { Size } from '../enums/Size';

class ParkService 
{
    private lotRepository: LotRepository;
    private ticketRepository: TicketRepository;

    constructor(lotRepository: LotRepository, ticketRepository: TicketRepository) {
        this.lotRepository = lotRepository;
        this.ticketRepository = ticketRepository;
    }

    async park(car: { plateNumber: string, size: number }) : Promise<Ticket> 
    {
        const newCar = new Car({
            plateNumber: car.plateNumber,
            size: car.size
        })

        // get lot has minimum number of free lots
        const lot : Lot  = (await this.lotRepository.findAll())
            .filter(lot => lot.getSize() === newCar.getSize())
            .filter(lot => lot.isFree())
            .reduce((prev:Lot, curr:Lot) => prev.getDistance() < curr.getDistance() ? prev : curr);

        if (!lot) {
            throw new Error('Lot not found');
        }

        const newTicket = new Ticket({
            plateNumber: newCar.getPlateNumber(),
            size: newCar.getSize(),
            lot_id: lot.getId(),
            time_start: new Date(),
        });

        const ticket = await this.ticketRepository.create(newTicket);

        if (!ticket) {
            throw new Error('Something went wrong');
        }

        lot.setUsed(true);
        const result = await this.lotRepository.update(lot.id, lot);

        if (!result) {
            throw new Error('Something went wrong');
        }

        return newTicket;
    }

    async leave(ticket: Ticket) : Promise<String> {
        ticket.setTimeEnd(new Date());

        await this.ticketRepository.update(ticket.getId(), ticket);

        const lot = await this.lotRepository.findById(ticket.getLotId());

        if (!lot) {
            throw new Error('Lot not found');
        }

        lot.setUsed(false);

        const result = await this.lotRepository.update(lot.id, lot);

        if (!result) {
            throw new Error('Something went wrong');
        }

        return 'ok';
    }
}

export default ParkService;