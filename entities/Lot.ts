import { ObjectId } from 'mongodb';
import { Size } from './../enums/Size';

export interface ILot {
    _id?: ObjectId;
    number: number;
    size: Size;
    distance?: number;
    isUsed?: boolean;
}

export class Lot {
    private _id: ObjectId;
    private number: number;
    private size: Size;
    private distance: number;
    private isUsed: boolean = false;

    constructor(props: ILot) {
        this._id = props._id || new ObjectId();
        this.number = props.number;
        this.size = props.size;
        this.distance = props.distance || 0;
        this.isUsed = props.isUsed || false;
    }

    setDistance(distance: number): void {
        this.distance = distance;
    }

    getDistance(): number {
        return this.distance;
    }

    get id(): ObjectId {
        return this._id;
    }

    getNumber(): number {
        return this.number;
    }

    getId(): ObjectId {
        return this._id;
    }

    isFree(): boolean {
        return !this.isUsed;
    }

    setUsed(isUsed: boolean): void {
        this.isUsed = isUsed;
    }

    getIsUsed(): boolean {
        return this.isUsed;
    }

    getSize(): Size {
        return this.size;
    }

    toObject(): ILot {
        return {
            _id: this._id,
            number: this.number,
            size: this.size,
            isUsed: this.isUsed,
            distance: this.distance
        };
    }
}