import { CarImage } from '@modules/cars/infra/typeorm/entities/CarImage';
import { ICarsImagesRepository } from '@modules/cars/repositories/ICarsImagesRepository';

class CarsImagesRepositoryInMemory implements ICarsImagesRepository {
  carImages: CarImage[] = [];

  async create(car_id: string, image_name: string): Promise<CarImage> {
    const carImage = new CarImage();

    Object.assign(carImage, {
      car_id,
      image_name,
    });

    this.carImages.push(carImage);

    return carImage;
  }
}

export { CarsImagesRepositoryInMemory };
