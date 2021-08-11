import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';

import { Car } from '../infra/typeorm/entities/Car';

interface ICarsRepository {
  create(data: ICreateCarDTO): Promise<Car>;
  findByLicensePlate(license_plate: string): Promise<Car>;
  findAvailable(): Promise<Car[]>;
}

export { ICarsRepository };
