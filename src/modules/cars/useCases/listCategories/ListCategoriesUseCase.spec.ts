import { ICategoriesRepository } from '@modules/cars/repositories/ICategoriesRepository';
import { CategoriesRepositoryInMemory } from '@modules/cars/repositories/in-memory/CategoriesRepositoryInMemory';

import { ListCategoriesUseCase } from './ListCategoriesUseCase';

let categoriesRepositoryInMemory: ICategoriesRepository;
let listCategoriesUseCase: ListCategoriesUseCase;

describe('List categories', () => {
  beforeEach(async () => {
    categoriesRepositoryInMemory = new CategoriesRepositoryInMemory();
    listCategoriesUseCase = new ListCategoriesUseCase(categoriesRepositoryInMemory);
  });

  it('should be able to list all categories created', async () => {
    const category = await categoriesRepositoryInMemory.create({
      name: 'Category Test',
      description: 'Category Test description',
    });

    const categories = await listCategoriesUseCase.execute();

    expect(categories).toEqual(expect.arrayContaining([category]));
  });
});
