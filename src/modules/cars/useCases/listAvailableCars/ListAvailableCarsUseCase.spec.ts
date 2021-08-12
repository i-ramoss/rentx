import { CarsRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe('Cars listing', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(carsRepositoryInMemory);
  });

  it('should be able to list all available cars', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car 00',
      description: 'Car Description',
      daily_rate: 140,
      license_plate: 'ABC-1234',
      fine_amount: 80,
      brand: 'Car Brand',
      category_id: 'category_id',
    });

    await carsRepositoryInMemory.create({
      name: 'Car 01',
      description: 'Car Description',
      daily_rate: 140,
      license_plate: 'ABC-1234',
      fine_amount: 80,
      brand: 'Car Brand',
      category_id: 'category_id',
    });

    await carsRepositoryInMemory.create({
      name: 'Car 02',
      description: 'Car Description',
      daily_rate: 140,
      license_plate: 'ABC-1234',
      fine_amount: 80,
      brand: 'Car Brand',
      category_id: 'category_id',
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual(expect.arrayContaining([car]));
  });

  it('should be able to list all available cars by name', async () => {
    await carsRepositoryInMemory.create({
      name: 'Car 01',
      description: 'Car Description',
      daily_rate: 140,
      license_plate: 'ABC-1234',
      fine_amount: 80,
      brand: 'Car Brand test',
      category_id: 'category_id',
    });

    await carsRepositoryInMemory.create({
      name: 'Car 02',
      description: 'Car 02 Description',
      daily_rate: 140,
      license_plate: 'ABC-1234',
      fine_amount: 80,
      brand: 'Car Brand test',
      category_id: 'category_id',
    });

    const cars = await listAvailableCarsUseCase.execute({ name: 'Car 02' });

    expect(cars).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Car 02',
        }),
      ])
    );
  });

  it('should be able to list all available cars by brand', async () => {
    await carsRepositoryInMemory.create({
      name: 'Car test',
      description: 'Car Description',
      daily_rate: 140,
      license_plate: 'ABC-1234',
      fine_amount: 80,
      brand: 'Car Brand test',
      category_id: 'category_id',
    });

    const cars = await listAvailableCarsUseCase.execute({ brand: 'Car Brand test' });

    expect(cars).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          brand: 'Car Brand test',
        }),
      ])
    );
  });

  it('should be able to list all available cars by category', async () => {
    await carsRepositoryInMemory.create({
      name: 'Car test',
      description: 'Car Description',
      daily_rate: 140,
      license_plate: 'ABC-1234',
      fine_amount: 80,
      brand: 'Car Brand test',
      category_id: '99999',
    });

    const cars = await listAvailableCarsUseCase.execute({ category_id: '99999' });

    expect(cars).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category_id: '99999',
        }),
      ])
    );
  });
});
