import ParkService from './../services/ParkService';
import { LotRepository } from './../repositories/LotRepository';
import { TicketRepository } from './../repositories/TicketRepository';

import { Size } from '../enums/Size';
import { Lot } from './../entities/Lot';

import connection from '../connection';

const lotRepository = new LotRepository(connection.getDatabase(), 'test__lots');
const ticketRepository = new TicketRepository(connection.getDatabase(), 'test__tickets');

const parkService = new ParkService(
  lotRepository, 
  ticketRepository
); 

describe('test ParkService', () => {
  test('Park car', async () => {
    const lots = [
      new Lot({ number: 1, size: Size.Small, distance: 5 }),
      new Lot({ number: 2, size: Size.Medium, distance: 10 }),
      new Lot({ number: 3, size: Size.Large, distance: 30 }),
    ];

    await lotRepository.createMany(lots);

    const ticket = await parkService.park({
      plateNumber: 'AA-AA-AA',
      size: Size.Small,
    })

    // get free lot
    const free_lot_less_then_total_lot = (await lotRepository.findAll())
      .filter(lot => lot.isFree())
      .length < lots.length;

    expect(free_lot_less_then_total_lot).toBe(true);
    
    expect(ticket.getPlateNumber()).toBe('AA-AA-AA');
    expect(ticket.getSize()).toBe(Size.Small);

    const lotFromDb = await lotRepository.findById(ticket.getLotId());

    expect(lotFromDb?.getNumber()).toBe(1);
    expect(lotFromDb?.getDistance()).toBe(5);
    expect(lotFromDb?.getSize()).toBe(Size.Small);
    expect(lotFromDb?.isFree()).toBe(false);

    // clear db
    await lotRepository.empty();
    await ticketRepository.empty();
  });

  test('Leave car', async  () => {
    await lotRepository.createMany([
      new Lot({ number: 1, size: Size.Small, distance: 5 }),
      new Lot({ number: 2, size: Size.Medium, distance: 10 }),
      new Lot({ number: 3, size: Size.Large, distance: 30 }),
    ]);

    const ticket = await parkService.park({
      plateNumber: 'AA-AA-AA',
      size: Size.Small,
    });

    await parkService.leave(ticket);

    // find lot by id
    const lotFound = await lotRepository.findById(ticket.getLotId());

    expect(lotFound?.isFree()).toBe(true);

    await lotRepository.empty();
    await ticketRepository.empty();
  });

} );