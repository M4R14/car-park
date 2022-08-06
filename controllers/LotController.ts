import { LotRepository } from '../repositories/LotRepository';
import connection from '../connection';

import { Router, Request, Response, NextFunction } from 'express';

class LotController {
    private lotRepository: LotRepository;

    constructor(lotRepository: LotRepository) {
        this.lotRepository = lotRepository;

        this.index = this.index.bind(this);
        this.create = this.create.bind(this);
    }

    // index list of lots
    async index(req: Request, res: Response, next: NextFunction) {
        const lots = await this.lotRepository.findAll();
        res.json(lots);
    }

    // create new lot
    async create(req: Request, res: Response, next: NextFunction) {
        const lot = await this.lotRepository.create(req.body);
        res.json(lot);
    }

    // delete lot
    async delete(req: Request, res: Response, next: NextFunction) {
        const result = await this.lotRepository.delete(req.params.id);
        res.json(result);
    }
}

const lotRepository = new LotRepository(connection.getDatabase(), 'lots');
export default new LotController(lotRepository);