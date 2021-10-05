import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';

class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = [];

  async create({
    name,
    description,
    daily_rate,
    license_plate,
    fine_amount,
    brand,
    category_id,
    specifications,
  }: ICreateCarDTO): Promise<Car> {
    const car = new Car();

    Object.assign(car, {
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id,
      specifications,
    });

    this.cars.push(car);

    return car;
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    return this.cars.find(car => car.license_plate === license_plate);
  }

  async findAvailable(name?: string, brand?: string, category_id?: string): Promise<Car[]> {
    const cars = this.cars
      .filter(car => (car.available === true ? car : null))
      .filter(car => {
        if (name && car.name === name) return car;
        if (brand && car.brand === brand) return car;
        if (category_id && car.category_id === category_id) return car;

        if (name || brand || category_id) return null;

        return car;
      });

    return cars;
  }

  async findById(car_id: string): Promise<Car> {
    return this.cars.find(car => car.id === car_id);
  }

  async updateAvailable(id: string, available: boolean): Promise<void> {
    const findIndex = this.cars.findIndex(car => car.id === id);

    this.cars[findIndex].available = available;
  }
}

export { CarsRepositoryInMemory };
