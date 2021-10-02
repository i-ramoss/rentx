import dayjs from 'dayjs';

import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';

import { ListRentalsByUserUseCase } from './ListRentalsByUserUseCase';

let rentalsRepositoryInMemory: IRentalsRepository;
let listRentalsByUserUseCase: ListRentalsByUserUseCase;

describe('List rentals by user', () => {
  const dayAdd24Hours = dayjs().add(25, 'h').toDate();

  beforeEach(async () => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    listRentalsByUserUseCase = new ListRentalsByUserUseCase(rentalsRepositoryInMemory);
  });

  it('should be able to list all rentals of an user', async () => {
    const rental = await rentalsRepositoryInMemory.create({
      user_id: '1234',
      car_id: '0000',
      expected_return_date: dayAdd24Hours,
    });

    const rentals = await listRentalsByUserUseCase.execute(rental.user_id);

    expect(rentals).toEqual(expect.arrayContaining([rental]));
    expect(rentals).toEqual(expect.arrayContaining([expect.objectContaining({ user_id: '1234' })]));
    expect(rentals).toEqual(expect.arrayContaining([expect.objectContaining({ car_id: '0000' })]));
  });
});
