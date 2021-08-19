import { AppError } from '@shared/errors/AppError';

import { RentalsRepositoryInMemory } from '../repositories/in-memory/RentalsRepositoryInMemory';
import { IRentalsRepository } from '../repositories/IRentalsRepository';
import { CreateRentalUseCase } from './CreateRentalUseCase';

let rentalsRepositoryInMemory: IRentalsRepository;
let createRentalUseCase: CreateRentalUseCase;

describe('Create Rental', () => {
  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory);
  });

  it('should be able to create a new rental', async () => {
    const rental = await createRentalUseCase.execute({
      user_id: '12345',
      car_id: '121212',
      expected_return_date: new Date(),
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('should not be able to create a new rental if the user already has one open', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: 'test',
        car_id: '121212',
        expected_return_date: new Date(),
      });

      await createRentalUseCase.execute({
        user_id: 'test',
        car_id: '44444',
        expected_return_date: new Date(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental if the car already has one open', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: '12345',
        car_id: 'test',
        expected_return_date: new Date(),
      });

      await createRentalUseCase.execute({
        user_id: '54321',
        car_id: 'test',
        expected_return_date: new Date(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
