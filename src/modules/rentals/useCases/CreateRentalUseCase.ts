import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { AppError } from '@shared/errors/AppError';

import { IRentalsRepository } from '../repositories/IRentalsRepository';

dayjs.extend(utc);

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

class CreateRentalUseCase {
  constructor(private rentalsRepository: IRentalsRepository) {}

  async execute({ user_id, car_id, expected_return_date }: IRequest): Promise<Rental> {
    const minimumRentalHour = 24;

    const rentalOpenToCar = await this.rentalsRepository.findOpenRentalByCar(car_id);
    const rentalOpenToUser = await this.rentalsRepository.findOpenRentalByUser(user_id);

    if (rentalOpenToCar) throw new AppError('There is a rental in progress for car!');
    if (rentalOpenToUser) throw new AppError('There is a rental in progress for user!');

    const expectedReturnDateFormat = dayjs(expected_return_date).utc().local().format();

    const dateNow = dayjs().utc().local().format();
    const compare = dayjs(expectedReturnDateFormat).diff(dateNow, 'hours');

    if (compare < minimumRentalHour)
      throw new AppError('The rental must have a minimum duration of 24 hours');

    const rental = await this.rentalsRepository.create({ user_id, car_id, expected_return_date });

    return rental;
  }
}

export { CreateRentalUseCase };
