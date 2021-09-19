import { sign } from 'jsonwebtoken';

import auth from '@config/auth';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { DayJsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { AuthenticateUserUseCase } from '../authenticateUser/AuthenticateUserUseCase';
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { RefreshTokenUseCase } from './RefreshTokenUseCase';

let usersRepositoryInMemory: IUsersRepository;
let usersTokensRepositoryInMemory: IUsersTokensRepository;
let dayJsDateProvider: IDateProvider;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let refreshTokenUseCase: RefreshTokenUseCase;

describe('Refresh token', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dayJsDateProvider = new DayJsDateProvider();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dayJsDateProvider
    );
    refreshTokenUseCase = new RefreshTokenUseCase(usersTokensRepositoryInMemory, dayJsDateProvider);
  });

  it('should be able to create a refresh token for the user', async () => {
    await createUserUseCase.execute({
      name: 'User test',
      email: 'user@test.com.br',
      password: '000',
      driver_license: 'xxxxxx',
    });

    const { refresh_token } = await authenticateUserUseCase.execute({
      email: 'user@test.com.br',
      password: '000',
    });

    const refreshToken = await refreshTokenUseCase.execute(refresh_token);

    expect(typeof refreshToken).toBe('string');
  });

  it('should not be able to create a refresh token for a invalid user token', async () => {
    const invalidToken = sign({}, auth.secret_refresh_token, {
      subject: 'invalid-user_id',
      expiresIn: auth.expires_in_refresh_token,
    });

    await expect(refreshTokenUseCase.execute(invalidToken)).rejects.toEqual(
      new AppError('Refresh Token does not exists!')
    );
  });
});
