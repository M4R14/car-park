import ParkService from './../services/ParkService';
import { LotRepository } from './../repositories/LotRepository';
import { TicketRepository } from './../repositories/TicketRepository';

import connection from '../connection';

export const lotRepository = new LotRepository(
    connection.getDatabase(), 
    'test__lots'
);

export const ticketRepository = new TicketRepository(
    connection.getDatabase(), 
    'test__tickets'
);

export const parkService = new ParkService(
  lotRepository, 
  ticketRepository
); 
