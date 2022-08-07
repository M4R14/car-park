import express, { Express, Request, Response } from 'express';
import lotController from './../controllers/LotController';
import parkController from '../controllers/ParkController';

const router = express.Router();

router.get('/lots', lotController.index);
router.get('/lots/:id', lotController.show);
router.post('/lots', lotController.create);
router.delete('/lots/:id', lotController.delete);

// park the car
router.post('/park', parkController.park);

// leave the slot
router.delete('/leave/:id', parkController.leave);

export default router;