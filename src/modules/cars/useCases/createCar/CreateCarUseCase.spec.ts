import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCarUseCase } from './CreateCarUseCase';

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('Create Car', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it('should be able to create a new car', async () => {
    await createCarUseCase.execute({
      name: 'Car name',
      description: 'Car description',
      daily_rate: 250,
      license_plate: 'ABC-1234',
      fine_amount: 120,
      brand: 'brand',
      category_id: 'category',
    });
  });

  it('should not be able to create an existing car, with the same license_plate', async () => {
    expect(async () => {
      await createCarUseCase.execute({
        name: 'Car 01',
        description: 'Car 01 description',
        daily_rate: 250,
        license_plate: 'ABC-123',
        fine_amount: 120,
        brand: 'brand',
        category_id: 'category',
      });

      await createCarUseCase.execute({
        name: 'Car 02',
        description: 'Car 02 description',
        daily_rate: 300,
        license_plate: 'ABC-123',
        fine_amount: 400,
        brand: 'brand',
        category_id: 'category',
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create a car with available as true by default', async () => {
    const car = await createCarUseCase.execute({
      name: 'Car Available',
      description: 'Car description',
      daily_rate: 250,
      license_plate: 'ABC-1234',
      fine_amount: 120,
      brand: 'brand',
      category_id: 'category',
    });

    console.log(car);

    expect(car.available).toBe(true);
  });
});
