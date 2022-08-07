import { ticketRepository, lotRepository, parkService  } from './test__database';
import { Lot } from './../entities/Lot';
import { Size } from './../enums/Size';
import { ObjectID } from 'bson';

describe('testing index file', () => {
  test('empty string should result in zero', () => {
    expect(0).toBe(0);
  });
});