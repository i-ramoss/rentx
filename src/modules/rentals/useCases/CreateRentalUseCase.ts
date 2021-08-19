import { AppError } from '@shared/errors/AppError';

import { IRentalsRepository } from '../repositories/IRentalsRepository';

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

class CreateRentalUseCase {
  constructor(private rentalsRepository: IRentalsRepository) {}

  async execute({ user_id, car_id, expected_return_date }: IRequest): Promise<void> {
    const rentalOpenToCar = await this.rentalsRepository.findOpenRentalByCar(car_id);
    const rentalOpenToUser = await this.rentalsRepository.findOpenRentalByUser(user_id);

    if (rentalOpenToCar) throw new AppError('There is a rental in progress for car!');
    if (rentalOpenToUser) throw new AppError('There is a rental in progress for user!');
  }
}

export { CreateRentalUseCase };
