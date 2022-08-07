import express, { Express, Request, Response } from 'express';
import lotController from './../controllers/LotController';
import parkController from '../controllers/ParkController';

const router = express.Router();

router.get('/lots', lotController.index);
router.post('/lots', lotController.create);
router.delete('/lots/:id', lotController.delete);

// park the car
router.post('/park', parkController.park);

export default router;