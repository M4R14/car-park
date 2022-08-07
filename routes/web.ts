import express, { Express, Request, Response } from 'express';
import LotController from './../controllers/LotController';
import ParkController from '../controllers/ParkController';
import TicketController from '../controllers/TicketController';
import connection from '../connection';
import { LotRepository } from '../repositories/LotRepository';
import { TicketRepository } from '../repositories/TicketRepository';
import ParkService from '../services/ParkService';

const lotRepository = new LotRepository(connection.getDatabase(), 'lots');
const ticketRepository = new TicketRepository(connection.getDatabase(), 'tickets');

const ticketController = new TicketController(ticketRepository);
const parkController = new ParkController(new ParkService(lotRepository, ticketRepository));
const lotController = new LotController(lotRepository);

const router = express.Router();

// lot routes
router.get('/lots', lotController.index);
router.get('/lots/:id', lotController.show);
// update lot
router.put('/lots/:id', lotController.update);
router.post('/lots', lotController.create);
router.delete('/lots/:id', lotController.delete);

// ticket routes
router.get('/tickets', ticketController.index);
router.get('/get-all-plate-number', ticketController.getAllPlateNumber);

// park the car
router.post('/park', parkController.park);
// leave the slot
router.post('/leave/:id', parkController.leave);

export default router;