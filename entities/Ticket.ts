import { ObjectId } from 'mongodb';
import { Size } from './../enums/Size';

export interface ITicket {
    _id?: ObjectId;
    plateNumber: string;
    size: Size;
    lot_id: ObjectId;
    time_start: Date;
    time_end?: Date | null;
}

export class Ticket {
    private _id: ObjectId;
    private lot_id: ObjectId;
    private plateNumber: string;
    private size: Size;
    private time_start: Date;
    private time_end: Date | null  = null;

    constructor(props: ITicket) {
        this._id = props._id || new ObjectId();
        this.lot_id = props.lot_id;
        this.plateNumber = props.plateNumber;
        this.size = props.size;
        this.time_start = props.time_start;
        this.time_end = props.time_end || null;
    }

    getId(): ObjectId {
        return this._id;
    }

    getSize(): Size {
        return this.size;
    }

    getTimeStart(): Date {
        return this.time_start;
    }

    setTimeEnd(time_end: Date): void {
        this.time_end = time_end;
    }

    getPlateNumber(): string {
        return this.plateNumber;
    }
    
    getLotId(): ObjectId {
        return this.lot_id;
    }

    toObject(): ITicket {
        return {
            _id: this._id,
            plateNumber: this.plateNumber,
            size: this.size,
            lot_id: this.lot_id,
            time_start: this.time_start,
            time_end: this.time_end
        };
    }
}