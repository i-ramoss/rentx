import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';

interface IRequest {
  name?: string;
  brand?: string;
  category_id?: string;
}
class ListCarsUseCase {
  constructor(private carsRepository: ICarsRepository) {}

  async execute({ name, brand, category_id }: IRequest): Promise<Car[]> {
    const cars = this.carsRepository.findAvailable(name, brand, category_id);

    return cars;
  }
}

export { ListCarsUseCase };
