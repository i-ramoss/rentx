import { sign } from 'jsonwebtoken';
import { v4 as uuidV4 } from 'uuid';

import auth from '@config/auth';
import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { AuthenticateUserUseCase } from '../authenticateUser/AuthenticateUserUseCase';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { ResetUserPasswordUseCase } from './ResetUserPasswordUseCase';

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let usersTokensRepositoryInMemory: IUsersTokensRepository;
let usersRepositoryInMemory: IUsersRepository;
let dayJsDateProvider: IDateProvider;
let resetUserPasswordUseCase: ResetUserPasswordUseCase;

describe('Reset user password', () => {
  const user: ICreateUserDTO = {
    name: 'User test',
    email: 'user@test.com.br',
    password: '000',
    driver_license: 'xxxxxxx',
  };

  beforeEach(() => {
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    dayJsDateProvider = new DayJsDateProvider();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dayJsDateProvider
    );
    resetUserPasswordUseCase = new ResetUserPasswordUseCase(
      usersTokensRepositoryInMemory,
      usersRepositoryInMemory,
      dayJsDateProvider
    );
  });

  it('Should be able to reset a user password', async () => {
    const deleteOlderPassword = spyOn(usersTokensRepositoryInMemory, 'deleteById');

    await createUserUseCase.execute(user);

    const { refresh_token } = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    await resetUserPasswordUseCase.execute({ token: refresh_token, password: user.password });

    expect(deleteOlderPassword).toHaveBeenCalled();
  });

  it('should not be able to reset a password for an invalid token', async () => {
    await createUserUseCase.execute(user);

    const invalidToken = sign({}, auth.secret_refresh_token, {
      subject: uuidV4(),
      expiresIn: auth.expires_in_refresh_token,
    });

    await expect(
      resetUserPasswordUseCase.execute({ token: invalidToken, password: user.password })
    ).rejects.toEqual(new AppError('Invalid Token!'));
  });

  it('should not be able to reset a password for a user expired token', async () => {
    await createUserUseCase.execute(user);

    const { refresh_token } = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    await expect(
      resetUserPasswordUseCase.execute({
        token: refresh_token,
        password: user.password,
        date_now: dayJsDateProvider.addDays(100),
      })
    ).rejects.toEqual(new AppError('Token expired'));
  });
});
