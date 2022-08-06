import { Lot } from '../entities/Lot';
import { Car } from '../entities/Car';

export class Ticket {
    private token: string;
    private lot: Lot;
    private car: Car;

    constructor(token: string, lot: Lot, car: Car) {
        this.token = token;
        this.lot = lot;
        this.car = car;
    }
}