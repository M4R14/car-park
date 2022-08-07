import { LotRepository } from '../repositories/LotRepository';
import { TicketRepository } from '../repositories/TicketRepository';

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

        // find a plateNumber in lotRepository
        const lot_has_car = await this.ticketRepository.findByPlateNumber(car.plateNumber);

        if (lot_has_car) {
            throw new Error('Car is already parked');
        }

        // get lot has minimum number of free lots
        const freeLots : Lot[]  = (await this.lotRepository.findAll()).filter(lot => lot.isFree())
            
        if (!freeLots.length) {
            throw new Error('No free lots');
        }

        const lot_size = freeLots.filter(lot => lot.getSize() === newCar.getSize());

        if (!lot_size.length) {
            throw new Error('No free lots of this size');
        }

        const lot = freeLots.reduce((prev:Lot, curr:Lot) => prev.getDistance() < curr.getDistance() ? prev : curr);

        console.log(lot);

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

    async leave(ticket_id: string) : Promise<String> {
        const ticket = await this.ticketRepository.findById(ticket_id);
        
        if (!ticket) {
            throw new Error('Ticket not found');
        }

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
    
    // get registration allocated slot number list by car size 
    async getSlotNumberList(size: Size) : Promise<number[]> {
        // get all lot with isUsed = true
        const lots = await this.lotRepository.findAll();
        const lots_used = lots.filter(lot => lot.getIsUsed());

        // get all id of lots
        const lots_id = lots_used.map(lot => lot.getId());

        // find all lots in TicketRepository with id in lots_id
        const tickets = await this.ticketRepository.findAll();
        const tickets_with_lot = tickets.filter(ticket => {
            const lot_id = ticket.getLotId();
            return lots_id.find(id => id.toString() === lot_id.toString()) !== undefined;
        });

        // filter all tickets by size
        const tickets_with_size = tickets_with_lot.filter(ticket => ticket.getSize() === size);

        // get all lot_id from tickets_with_size
        const lot_ids = tickets_with_size.map(ticket => ticket.getLotId());

        // get all lots with id in lot_ids
        const lots_with_id = lots.filter(lot => {
            return lot_ids.find(id => id.toString() === lot.getId().toString()) !== undefined
        });

        return lots_with_id.map(lot => lot.getNumber());
    }
}

export default ParkService;