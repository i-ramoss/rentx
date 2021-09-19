import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: DayJsDateProvider;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dateProvider = new DayJsDateProvider();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('should be able to authenticate a user', async () => {
    await createUserUseCase.execute({
      name: 'User Test',
      email: 'user@test.com',
      password: '000',
      driver_license: '123456',
    });

    const result = await authenticateUserUseCase.execute({
      email: 'user@test.com',
      password: '000',
    });

    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('refresh_token');
    expect(result.user.email).toEqual('user@test.com');
  });

  it('should not be able to authenticate a none existent user', async () => {
    await createUserUseCase.execute({
      name: 'User Test',
      email: 'user@test.com',
      password: '000',
      driver_license: '123456',
    });

    await expect(
      authenticateUserUseCase.execute({
        email: 'false@email.com',
        password: '000',
      })
    ).rejects.toEqual(new AppError('Email or password incorrect!'));
  });

  it('should not be able to authenticate a user with incorrect password', async () => {
    await createUserUseCase.execute({
      name: 'User Test Error',
      email: 'user@test.com',
      password: '000',
      driver_license: '123456',
    });

    await expect(
      authenticateUserUseCase.execute({
        email: 'user@test.com',
        password: 'incorrectPassword',
      })
    ).rejects.toEqual(new AppError('Email or password incorrect!'));
  });
});
