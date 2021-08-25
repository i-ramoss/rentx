import { Repository, getRepository } from 'typeorm';

import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO';
import { IRentalsRepository } from '@modules/rentals/repositories/IRentalsRepository';

import { Rental } from '../entities/Rental';

class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  async findOpenRentalByCar(car_id: string): Promise<Rental> {
    return this.repository.findOne({ car_id });
  }

  async findOpenRentalByUser(user_id: string): Promise<Rental> {
    return this.repository.findOne({ user_id });
  }

  async create({ user_id, car_id, expected_return_date }: ICreateRentalDTO): Promise<Rental> {
    const rental = this.repository.create({ user_id, car_id, expected_return_date });

    await this.repository.save(rental);

    return rental;
  }

  async findById(rental_id: string): Promise<Rental> {
    return this.repository.findOne(rental_id);
  }
}

export { RentalsRepository };
