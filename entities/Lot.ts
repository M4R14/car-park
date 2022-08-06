import { Size } from './../enums/Size';

export interface ILot {
    _id: string;
    number: number;
    size: Size;
    isUsed: boolean;
}

export class Lot {
    private _id: string;
    private number: number;
    private size: Size;
    private isUsed: boolean = false;

    constructor({ _id, number, size, isUsed }: ILot) {
        this._id = _id;
        this.number = number;
        this.size = size;
        this.isUsed = isUsed || false;
    }

    toObject(): ILot {
        return {
            _id: this._id,
            number: this.number,
            size: this.size,
            isUsed: this.isUsed
        };
    }
}