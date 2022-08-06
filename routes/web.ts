import express, { Express, Request, Response } from 'express';
import lotController from './../controllers/LotController';

const router = express.Router();

router.get('/lots', lotController.index);
router.post('/lots', lotController.create);
router.delete('/lots/:id', lotController.delete);

export default router;