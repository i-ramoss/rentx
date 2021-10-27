import { v4 as uuidV4 } from 'uuid';

import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';

import { ProfileUserUseCase } from './ProfileUserUseCase';

let usersRepository: UsersRepositoryInMemory;
let userProfileUseCase: ProfileUserUseCase;

describe('User Profile', () => {
  beforeEach(async () => {
    usersRepository = new UsersRepositoryInMemory();
    userProfileUseCase = new ProfileUserUseCase(usersRepository);
  });

  it('should be able to show the user profile', async () => {
    const user = await usersRepository.create({
      id: uuidV4(),
      name: 'User Test',
      email: 'user_test@rentx.com.br',
      password: '000',
      driver_license: 'xxxxxxx',
    });

    const profile = await userProfileUseCase.execute(user.id);

    expect(profile).toHaveProperty('avatar');
    expect(profile).toHaveProperty('avatar_url');
    expect(typeof profile).toBe('object');
  });
});
