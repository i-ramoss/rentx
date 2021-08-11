import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import { ListCarsUseCase } from './ListCarsUseCase';

let listCarsUseCase: ListCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('Cars listing', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listCarsUseCase = new ListCarsUseCase(carsRepositoryInMemory);
  });

  it('should be able to list all available cars', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car 01',
      description: 'Car Description',
      daily_rate: 140,
      license_plate: 'ABC-1234',
      fine_amount: 80,
      brand: 'Car Brand',
      category_id: 'category_id',
    });

    const cars = await listCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  it('should be able to list all available cars by car name', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car 02',
      description: 'Car Description',
      daily_rate: 140,
      license_plate: 'ABC-1234',
      fine_amount: 80,
      brand: 'Car Brand test',
      category_id: 'category_id',
    });

    const cars = await listCarsUseCase.execute({ brand: 'Car Brand' });

    expect(cars).toEqual([car]);
  });
});
