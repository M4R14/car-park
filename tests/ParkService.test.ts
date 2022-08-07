import {
  lotRepository,
  ticketRepository,
  parkService
} from './test__database';

import { ObjectId } from 'mongodb';

import { Size } from '../enums/Size';
import { Lot } from './../entities/Lot';

const lot_data_set = () =>  [
  new Lot({ number: 1, size: Size.Small, distance: 5 }),
  new Lot({ number: 2, size: Size.Medium, distance: 10 }),
  new Lot({ number: 3, size: Size.Large, distance: 30 }),
];

describe('test ParkService', () => {
  test('Park car', async () => {

    const total_lots = await lotRepository.count();

    const lots = lot_data_set();
    await lotRepository.createMany(lots);

    // random plate number
    const plate_number = Math.random().toString(36).substring(7);

    const ticket = await parkService.park({
      plateNumber: plate_number,
      size: Size.Small,
    })

    // get free lot
    const free_lot_less_then_total_lot = (await lotRepository.findAll())
      .filter(lot => lot.isFree())
      .length < total_lots;

    expect(free_lot_less_then_total_lot).toBe(true);
    
    expect(ticket.getPlateNumber()).toBe(plate_number);
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
    const lots =  lot_data_set();
    await lotRepository.createMany(lots);

    const ticket = await parkService.park({
      plateNumber: 'AA-AA-AA',
      size: Size.Small,
    });

    await parkService.leave(ticket.getId().toString());

    // find lot by id
    const lotFound = await lotRepository.findById(ticket.getLotId());

    expect(lotFound?.isFree()).toBe(true);

    await lotRepository.empty();
    await ticketRepository.empty();
  });


  //  get registration allocated slot number list by car size 
  test('get registration allocated slot number list by car size', async () => {
    await lotRepository.createMany([
      new Lot({ number: 1, size: Size.Small, distance: 5 }),
      new Lot({ number: 2, size: Size.Medium, distance: 10 }),
      new Lot({ number: 3, size: Size.Large, distance: 30 }),
      new Lot({ number: 4, size: Size.Large, distance: 32 }),
      new Lot({ number: 5, size: Size.Large, distance: 33 }),
      new Lot({ number: 6, size: Size.Large, distance: 34 }),
    ]);

    // random plate number
    const r_plate_number = () => Math.random().toString(36).substring(7);

    const cars = [
      {
        plateNumber: r_plate_number(),
        size: Size.Small,
      },
      {
        plateNumber: r_plate_number(),
        size: Size.Medium,
      },
      {
        plateNumber: r_plate_number(),
        size: Size.Large,
      },
      {
        plateNumber: r_plate_number(),
        size: Size.Large,
      }
    ];

    cars.forEach(async car => {
      await parkService.park(car);
    });

    const tickets = await (await ticketRepository.findAll())
      .filter(ticket => ticket.getSize() == Size.Large);

    const lot_ids: ObjectId[]  = tickets.map(ticket => ticket.getId());

    console.log(lot_ids);

    // get lot by lot_ids
    const lots = await lotRepository.findByIds(lot_ids);

    console.log(lots);
    
    expect(lots.length).toBe(2);
    expect(lots.map(lot => lot.getSize())).toBe([
      Size.Large,
      Size.Large,
    ]);

    await lotRepository.empty();
    await ticketRepository.empty();
  }),

  // get registration plate number list by car size 
  test('get registration plate number list by car size', async () => {
    await lotRepository.createMany([
      new Lot({ number: 1, size: Size.Small, distance: 5 }),
      new Lot({ number: 2, size: Size.Medium, distance: 10 }),
      new Lot({ number: 3, size: Size.Large, distance: 30 }),
      new Lot({ number: 4, size: Size.Large, distance: 32 }),
      new Lot({ number: 5, size: Size.Large, distance: 33 }),
      new Lot({ number: 6, size: Size.Large, distance: 34 }),
    ]);

    parkService.park({
      plateNumber: 'AA-AA-AA',
      size: Size.Small,
    });

    parkService.park({
      plateNumber: 'BB-BB-BB',
      size: Size.Medium,
    });

    parkService.park({
      plateNumber: 'CC-CC-CC',
      size: Size.Large,
    });

    parkService.park({
      plateNumber: 'DD-DD-DD',
      size: Size.Large,
    });

    const tickets = await ticketRepository.findAll()
    const tickets_by_car_size =  tickets.filter(ticket => ticket.getSize() == Size.Large);
    const plateNumbers = tickets_by_car_size.map(ticket => ticket.getPlateNumber());
    
    expect(plateNumbers).toBe([
      'CC-CC-CC',
      'DD-DD-DD',
    ]);

    await ticketRepository.empty();
    await lotRepository.empty();
  });

} );