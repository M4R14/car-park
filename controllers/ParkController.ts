import { LotRepository } from '../repositories/LotRepository';
import { TicketRepository } from '../repositories/TicketRepository';
import connection from '../connection';

import { Ticket } from '../entities/Ticket';
import { Car } from '../entities/Car';
import { Lot } from '../entities/Lot';

import ParkService from './../services/ParkService';
import { Router, Request, Response, NextFunction } from 'express';
import { Size } from '../enums/Size';

const validate_park = (data: any) => {
    if (!data.plateNumber || !data.size) {
        throw new Error('Missing parameters');
    }

    // size has values in Size enum
    if (!Object.values(Size).includes(data.size)) {
        throw new Error('Invalid size');
    }

    // plateNumber is a string with length greater than 0
    if (data.plateNumber.length < 1) {
        throw new Error('Invalid plateNumber');
    }

    return true;
}

class ParkController {
    private parkService: ParkService;

    constructor(parkService: ParkService) {
        this.parkService = parkService;

        this.park = this.park.bind(this);
        this.leave = this.leave.bind(this);
        this.getAllAllocatedSlots = this.getAllAllocatedSlots.bind(this);
    }

    // get registration allocated slot number list by car size 
    async getAllAllocatedSlots(req: Request, res: Response, next: NextFunction) {
        const size: number = Number(req.query.size);

        console.log(size, req.query.size);

        if (!(size in Size)) {
            res.status(400).json({
                message: 'Invalid size'
            });
            return;
        }

        const result: number[] = await this.parkService.getSlotNumberList(size);
        res.json(result);
    }

    async park(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const car: {
                plateNumber: string,
                size: number
            } = req.body;

            validate_park(car);

            const ticket: Ticket = await this.parkService.park(car);
            res.json(ticket);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    message: error.message,
                });
            }
        }
    }

    // leave the slot
    async leave(req: Request, res: Response, next: NextFunction) {
        try {
            const ticket_id: string = req.params.id;
            const result: String = await this.parkService.leave(ticket_id);
            res.json(result);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    message: error.message
                });
            }
        }
    }
}

export default ParkController;