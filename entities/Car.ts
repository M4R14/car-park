import { Size } from './../enums/Size';

interface ICar {
    _id?: string;
    plateNumber: string;
    size: Size;
}

export class Car {
    private _id: string;
    private plateNumber: string;
    private size: Size;

    constructor({ _id, plateNumber, size }: ICar) {
        this._id = _id || '';
        this.plateNumber = plateNumber;
        this.size = size;
    }

    getSize(): Size {
        return this.size;
    }

    getPlateNumber(): string {
        return this.plateNumber;
    }

    toObject(): ICar {
        return {
            _id: this._id,
            plateNumber: this.plateNumber,
            size: this.size
        };
    }
}