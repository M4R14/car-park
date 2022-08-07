import { LotRepository } from '../repositories/LotRepository';
import connection from '../connection';

import { Router, Request, Response, NextFunction } from 'express';
import { Lot } from '../entities/Lot';
import { Size } from '../enums/Size';
import { ObjectId } from 'mongodb';

const validate_create = (data: any) => {
    if (!data.size || !data.distance || !data.number) {
        throw new Error('Missing parameters');
    }

    // lot_input has values in Size enum
    if (!Object.values(Size).includes(data.size)) {
        throw new Error('Invalid size');
    }

    // distance is a number greater than 0
    if (data.distance < 0) {
        throw new Error('Invalid distance');
    }

    // number is a number greater than 0
    if (data.number < 0) {
        throw new Error('Invalid number');
    }

    return true;
}

class LotController {
    private lotRepository: LotRepository;

    constructor(lotRepository: LotRepository) {
        this.lotRepository = lotRepository;

        this.index = this.index.bind(this);
        this.create = this.create.bind(this);
        this.delete = this.delete.bind(this);
        this.show = this.show.bind(this);
    }

    // index list of lots
    async index(req: Request, res: Response, next: NextFunction) {
        const lots = await this.lotRepository.findAll();
        res.json(lots);
    }

    // create new lot
    async create(req: Request, res: Response, next: NextFunction) {
        const lot_input: {
            size: number,
            distance: number
            number: number
        } = req.body;

        try {
            validate_create(lot_input);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    message: error.message
                });
            }
            return;
        }

        // get lot by number
        const lot_by_number = await this.lotRepository.findByNumber(lot_input.number);

        // if lot with number exists, return error
        if (lot_by_number) {
            res.status(500).json({
                message: 'Lot with number already exists'
            });
            return;
        }

        // create new lot
        const lot = await this.lotRepository.create(req.body);

        if (!lot) {
            res.status(500).json({
                message: 'Error creating lot'
            });
        }

        res.json({
            message: 'Lot created'
        });
    }

    // shew lot info
    async show(req: Request, res: Response, next: NextFunction) {
        const lot_id = new ObjectId(req.params.id);
        const lot = await this.lotRepository.findById(lot_id);
        res.json(lot);
    }

    // delete lot
    async delete(req: Request, res: Response, next: NextFunction) {
        const lot_id = new ObjectId(req.params.id);

        if (!await this.lotRepository.findById(lot_id)) {
            res.status(404).json({
                message: 'Lot not found'
            });
            return;
        }

        const result = await this.lotRepository.delete(lot_id);

        if (!result) {
            res.status(500).json({
                message: 'Error deleting lot'
            });
        } else {
            res.json({
                message: 'Lot deleted'
            });
        }
    }
}

const lotRepository = new LotRepository(connection.getDatabase(), 'lots');
export default new LotController(lotRepository);