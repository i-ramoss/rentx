import { CarsImagesRepositoryInMemory } from '@modules/cars/repositories/in-memory/CarsImagesRepositoryInMemory';

import { UploadCarImagesUseCase } from './UploadCarImageUseCase';

let carsImagesRepositoryInMemory: CarsImagesRepositoryInMemory;
let uploadCarImageUseCase: UploadCarImagesUseCase;

describe('Upload car image', () => {
  beforeEach(() => {
    carsImagesRepositoryInMemory = new CarsImagesRepositoryInMemory();
    uploadCarImageUseCase = new UploadCarImagesUseCase(carsImagesRepositoryInMemory);
  });

  it('should be able to upload car images', async () => {
    const uploadCarImage = spyOn(carsImagesRepositoryInMemory, 'create');

    await uploadCarImageUseCase.execute({
      car_id: '12356',
      images_name: ['photo1', 'photo2', 'photo3'],
    });

    expect(uploadCarImage).toHaveBeenCalled();
  });
});
