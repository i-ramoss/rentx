import fs from 'fs';
import path from 'path';

import { CarsImagesRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsImagesRepositoryInMemory';
import { LocalStorageProvider } from '@shared/container/providers/StorageProvider/implementations/LocalStorageProvider';

import { UploadCarImagesUseCase } from './UploadCarImageUseCase';

let carsImagesRepositoryInMemory: CarsImagesRepositoryInMemory;
let localStorageProvider: LocalStorageProvider;
let uploadCarImageUseCase: UploadCarImagesUseCase;

describe('Upload car image', () => {
  beforeEach(() => {
    carsImagesRepositoryInMemory = new CarsImagesRepositoryInMemory();
    localStorageProvider = new LocalStorageProvider();
    uploadCarImageUseCase = new UploadCarImagesUseCase(
      carsImagesRepositoryInMemory,
      localStorageProvider
    );
  });

  it('should be able to upload car images', async () => {
    const uploadCarImage = spyOn(carsImagesRepositoryInMemory, 'create');

    const car_image01 = path.resolve('assets/car_image01.jpg');

    const tmpPath01 = path.resolve('tmp/car_image01.jpg');

    await fs.promises.copyFile(car_image01, tmpPath01);

    await uploadCarImageUseCase.execute({
      car_id: '12356',
      images_name: [path.basename(car_image01)],
    });

    await localStorageProvider.delete(path.basename(car_image01), 'cars');

    expect(uploadCarImage).toHaveBeenCalled();
  });
});
