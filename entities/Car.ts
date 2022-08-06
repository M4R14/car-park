import { Size } from './../enums/Size';

export class Car {
    private plateNumber: string;
    private size: Size;

    constructor(plateNumber: string, size: Size) {
        this.plateNumber = plateNumber;
        this.size = size;
    }
}