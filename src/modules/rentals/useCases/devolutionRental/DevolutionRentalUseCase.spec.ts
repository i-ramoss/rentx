import dayjs from 'dayjs';

import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { RentalsRepositoryInMemory } from '@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { DevolutionRentalUseCase } from './DevolutionRentalUseCase';

let rentalsRepositoryInMemory: IRentalsRepository;
let carsRepositoryInMemory: ICarsRepository;
let dayJsDateProvider: IDateProvider;
let devolutionRentalUseCase: DevolutionRentalUseCase;

describe('Devolution a Rental', () => {
  const dayAdd24Hours = dayjs().add(25, 'h').toDate();

  const carTest: ICreateCarDTO = {
    name: 'Car Test',
    description: 'Car test description',
    daily_rate: 100,
    license_plate: 'xxx-test-xxxx',
    fine_amount: 50,
    category_id: '1234',
    brand: 'Brand test',
  };

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    dayJsDateProvider = new DayJsDateProvider();

    devolutionRentalUseCase = new DevolutionRentalUseCase(
      rentalsRepositoryInMemory,
      carsRepositoryInMemory,
      dayJsDateProvider
    );
  });

  it('should be able to return a rent', async () => {
    const car = await carsRepositoryInMemory.create(carTest);

    const rental = await rentalsRepositoryInMemory.create({
      user_id: '12345',
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    const devolution = await devolutionRentalUseCase.execute({ id: rental.id });

    expect(devolution).toHaveProperty('total');
    expect(devolution).toHaveProperty('end_date');
    expect(devolution.total).toBe(100);
    expect(car.available).toBe(true);
  });

  it('should not be able to return a non-existent rent', async () => {
    await expect(devolutionRentalUseCase.execute({ id: 'invalid-id' })).rejects.toEqual(
      new AppError('Rental not found!')
    );
  });

  it('should be able to apply a late fee when returning a rent', async () => {
    const car = await carsRepositoryInMemory.create(carTest);

    const rental = await rentalsRepositoryInMemory.create({
      user_id: '12345',
      car_id: car.id,
      expected_return_date: dayjs().subtract(1, 'day').toDate(),
      start_date: dayjs().subtract(2, 'day').toDate(),
    });

    const devolution = await devolutionRentalUseCase.execute({ id: rental.id });

    expect(devolution).toHaveProperty('total');
    expect(devolution).toHaveProperty('end_date');
    expect(devolution.total).toBe(150);
    expect(car.available).toBe(true);
  });
});
