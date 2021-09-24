import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';

import { UpdateUserAvatarUseCase } from './UpdateUserAvatarUseCase';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let updateUserAvatarUseCase: UpdateUserAvatarUseCase;

describe('Update user avatar', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    updateUserAvatarUseCase = new UpdateUserAvatarUseCase(usersRepositoryInMemory);
  });

  it('should be able to update a user avatar', async () => {
    const { id: user_id } = await usersRepositoryInMemory.create({
      name: 'User test',
      email: 'user@test.com',
      password: '0000',
      driver_license: 'xxxxxx',
    });

    const avatar_file = 'profile.png';

    const updateUserAvatar = spyOn(usersRepositoryInMemory, 'create');

    await updateUserAvatarUseCase.execute({ user_id, avatar_file });

    expect(updateUserAvatar).toHaveBeenCalled();
  });
});
