import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { AppError } from '@shared/errors/AppError';

import { CreateUserUseCase } from './CreateUserUseCase';

let usersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('Create user', () => {
  beforeEach(async () => {
    usersRepository = new UsersRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it('should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'User Test',
      email: 'user_test@rentx.com.br',
      password: '000',
      driver_license: 'xxxxxxx',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with existing email', async () => {
    await createUserUseCase.execute({
      name: 'User Test',
      email: 'user_test@rentx.com.br',
      password: '000',
      driver_license: 'xxxxxxx',
    });

    await expect(
      createUserUseCase.execute({
        name: 'User Test',
        email: 'user_test@rentx.com.br',
        password: '000',
        driver_license: 'xxxxxxx',
      })
    ).rejects.toEqual(new AppError('User already exists!'));
  });
});
