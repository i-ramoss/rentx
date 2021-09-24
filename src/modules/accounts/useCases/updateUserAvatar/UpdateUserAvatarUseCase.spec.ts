import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { fileMethods } from '@utils/file';

import { UpdateUserAvatarUseCase } from './UpdateUserAvatarUseCase';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let updateUserAvatarUseCase: UpdateUserAvatarUseCase;

describe('Update user avatar', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    updateUserAvatarUseCase = new UpdateUserAvatarUseCase(usersRepositoryInMemory);
  });

  it('should be able to add a user avatar', async () => {
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

  it('should be able to remove the users old avatar, and replace it with the new', async () => {
    const user = await usersRepositoryInMemory.create({
      name: 'User test',
      email: 'user@test.com',
      password: '0000',
      driver_license: 'xxxxxx',
    });

    const deleteOlderImageFile = spyOn(fileMethods, 'deleteFile');

    const first_avatar_file = 'profile01.png';
    const second_avatar_file = 'profile02.png';

    await updateUserAvatarUseCase.execute({ user_id: user.id, avatar_file: first_avatar_file });

    await updateUserAvatarUseCase.execute({ user_id: user.id, avatar_file: second_avatar_file });

    expect(deleteOlderImageFile).toHaveBeenCalled();
  });
});
