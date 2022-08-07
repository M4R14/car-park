import { LotRepository } from '../repositories/LotRepository';
import { TicketRepository } from '../repositories/TicketRepository';
import connection from '../connection';

import { Ticket } from '../entities/Ticket';
import { Car } from '../entities/Car';
import { Lot } from '../entities/Lot';

import ParkService from './../services/ParkService';

class ParkController
{
    private parkService: ParkService;

    constructor(parkService: ParkService) {
        this.parkService = parkService;

        this.park = this.park.bind(this);
        this.leave = this.leave.bind(this);
    }

    async park(req: Request, res: Response, next: NextFunction) {
        try {
            const ticket : Ticket  = await this.parkService.park(req.body);
            res.json(ticket);
        } catch (error: Error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    // leave the slot
    async leave(req: Request, res: Response, next: NextFunction) {
        try {
            const result : String = await this.parkService.leave(req.params.id);
            res.json(result);
        } catch (error: Error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    // get status of parking lot
    async status(req: Request, res: Response, next: NextFunction) {
        try {
            const lots = await this.parkService.getStatus();
            res.json(lots);
        } catch (error: Error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    // search for a car in the parking lot
    async search(req: Request, res: Response, next: NextFunction) {
        try {
            const car = await this.parkService.search(req.params.plateNumber);
            res.json(car);
        } catch (error: Error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

}

export default new ParkController(
    new ParkService(
        new LotRepository(connection.getDatabase(), 'lots'),
        new TicketRepository(connection.getDatabase(), 'tickets')
    )
);