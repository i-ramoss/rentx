import { SpecificationsRepositoryInMemory } from '@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory';
import {
  ICreateSpecificationDTO,
  ISpecificationsRepository,
} from '@modules/cars/repositories/ISpecificationsRepository';
import { AppError } from '@shared/errors/AppError';

import { CreateSpecificationUseCase } from './CreateSpecificationUseCase';

let specificationsRepository: ISpecificationsRepository;
let createSpecificationUseCase: CreateSpecificationUseCase;

describe('Create Specification', () => {
  const specificationTest: ICreateSpecificationDTO = {
    name: 'Specification Test',
    description: 'Specification Test description',
  };

  beforeEach(async () => {
    specificationsRepository = new SpecificationsRepositoryInMemory();
    createSpecificationUseCase = new CreateSpecificationUseCase(specificationsRepository);
  });

  it('should be able to create a new specification', async () => {
    await createSpecificationUseCase.execute({
      name: specificationTest.name,
      description: specificationTest.description,
    });

    const specification = await specificationsRepository.findByName('Specification Test');

    expect(specification).toHaveProperty('id');
    expect(specification.name).toEqual(specificationTest.name);
    expect(specification.description).toEqual(specificationTest.description);
  });

  it('should not be able to create a new specification with existing name', async () => {
    await createSpecificationUseCase.execute({
      name: specificationTest.name,
      description: specificationTest.description,
    });

    await expect(
      createSpecificationUseCase.execute({
        name: specificationTest.name,
        description: specificationTest.description,
      })
    ).rejects.toEqual(new AppError('Specification already Exists!'));
  });
});
