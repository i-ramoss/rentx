import dayjs from 'dayjs';

import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let rentalsRepositoryInMemory: IRentalsRepository;
let dayJsProvider: DayJsDateProvider;
let createRentalUseCase: CreateRentalUseCase;

describe('Create Rental', () => {
  const dayAdd24Hours = dayjs().add(1, 'day').toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dayJsProvider = new DayJsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(rentalsRepositoryInMemory, dayJsProvider);
  });

  it('should be able to create a new rental', async () => {
    const rental = await createRentalUseCase.execute({
      user_id: '12345',
      car_id: '121212',
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });

  it('should not be able to create a new rental if the user already has one open', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: 'test',
        car_id: '121212',
        expected_return_date: dayAdd24Hours,
      });

      await createRentalUseCase.execute({
        user_id: 'test',
        car_id: '44444',
        expected_return_date: dayAdd24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental if the car already has one open', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: '12345',
        car_id: 'test',
        expected_return_date: dayAdd24Hours,
      });

      await createRentalUseCase.execute({
        user_id: '54321',
        car_id: 'test',
        expected_return_date: dayAdd24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental with invalid return time', async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: '12345',
        car_id: 'test',
        expected_return_date: dayjs().toDate(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
