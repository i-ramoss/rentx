import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

class CreateRentalUseCase {
  constructor(private rentalsRepository: IRentalsRepository, private dateProvider: IDateProvider) {}

  async execute({ user_id, car_id, expected_return_date }: IRequest): Promise<Rental> {
    const minimumRentalHour = 24;

    const rentalOpenToCar = await this.rentalsRepository.findOpenRentalByCar(car_id);
    const rentalOpenToUser = await this.rentalsRepository.findOpenRentalByUser(user_id);

    if (rentalOpenToCar) throw new AppError('There is a rental in progress for car!');
    if (rentalOpenToUser) throw new AppError('There is a rental in progress for user!');

    const dateNow = this.dateProvider.dateNow();
    const compare = this.dateProvider.compareInHours(dateNow, expected_return_date);

    if (compare < minimumRentalHour) throw new AppError('Invalid return time!');

    const rental = await this.rentalsRepository.create({ user_id, car_id, expected_return_date });

    return rental;
  }
}

export { CreateRentalUseCase };