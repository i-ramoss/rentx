import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';

interface ICarsRepository {
  create(data: ICreateCarDTO): Promise<void>;
}

export { ICarsRepository };
