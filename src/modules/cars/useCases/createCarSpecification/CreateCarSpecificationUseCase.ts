import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { ICarsRepository } from '@modules/cars/repositories/ICarsRepository';
import { ISpecificationsRepository } from '@modules/cars/repositories/ISpecificationsRepository';

import { AppError } from '../../../../shared/errors/AppError';

interface IRequest {
  car_id: string;
  specifications_id: string[];
}

class CreateCarSpecificationUseCase {
  constructor(
    private carsRepository: ICarsRepository,
    private specificationsRepository: ISpecificationsRepository
  ) {}

  async execute({ car_id, specifications_id }: IRequest): Promise<Car> {
    const carExists = await this.carsRepository.findById(car_id);

    if (!carExists) throw new AppError('Car doest not exists!');

    const specifications = await this.specificationsRepository.findByIds(specifications_id);

    carExists.specifications = specifications;

    await this.carsRepository.create(carExists);

    return carExists;
  }
}

export { CreateCarSpecificationUseCase };
