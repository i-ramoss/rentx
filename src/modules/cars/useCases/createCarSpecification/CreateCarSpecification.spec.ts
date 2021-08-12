import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import { AppError } from '../../../../shared/errors/AppError';
import { CreateCarSpecificationUseCase } from './CreateCarSpecificationUseCase';

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('Create Car Specification', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(carsRepositoryInMemory);
  });

  it('should not be able to add a new specification to an non-existent car', () => {
    expect(async () => {
      const car_id = '1234';
      const specifications_id = ['00000'];

      await createCarSpecificationUseCase.execute({ car_id, specifications_id });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to add a new specification to the car', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car name',
      description: 'Car description',
      daily_rate: 250,
      license_plate: 'ABC-1234',
      fine_amount: 120,
      brand: 'brand',
      category_id: 'category',
    });

    const specifications_id = ['00000'];

    await createCarSpecificationUseCase.execute({ car_id: car.id, specifications_id });
  });
});
