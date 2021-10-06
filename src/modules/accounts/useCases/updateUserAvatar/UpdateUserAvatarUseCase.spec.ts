import fs from 'fs';
import path from 'path';

import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { LocalStorageProvider } from '@shared/container/providers/StorageProvider/implementations/LocalStorageProvider';

import { UpdateUserAvatarUseCase } from './UpdateUserAvatarUseCase';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let storageProvider: LocalStorageProvider;
let updateUserAvatarUseCase: UpdateUserAvatarUseCase;

describe('Update user avatar', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    storageProvider = new LocalStorageProvider();
    updateUserAvatarUseCase = new UpdateUserAvatarUseCase(usersRepositoryInMemory, storageProvider);
  });

  it('should be able to add a user avatar', async () => {
    const { id: user_id } = await usersRepositoryInMemory.create({
      name: 'User test',
      email: 'user@test.com',
      password: '0000',
      driver_license: 'xxxxxx',
    });

    const avatarPath = path.resolve('assets/profile01.jpg');
    const tmpPath = path.resolve('tmp/profile01.jpg');

    await fs.promises.copyFile(avatarPath, tmpPath);

    const updateUserAvatar = spyOn(usersRepositoryInMemory, 'create');

    await updateUserAvatarUseCase.execute({ user_id, avatar_file: path.basename(avatarPath) });

    expect(updateUserAvatar).toHaveBeenCalled();
  });

  it('should be able to remove the users old avatar, and replace it with the new', async () => {
    const user = await usersRepositoryInMemory.create({
      name: 'User test',
      email: 'user@test.com',
      password: '0000',
      driver_license: 'xxxxxx',
    });

    const first_avatar_path = path.resolve('assets/profile01.jpg');
    const second_avatar_path = path.resolve('assets/profile02.jpg');

    const tmpPath01 = path.resolve('tmp/profile01.jpg');
    const tmpPath02 = path.resolve('tmp/profile02.jpg');

    await fs.promises.copyFile(first_avatar_path, tmpPath01);
    await fs.promises.copyFile(second_avatar_path, tmpPath02);

    const deleteOlderImageFile = spyOn(storageProvider, 'delete');

    await updateUserAvatarUseCase.execute({
      user_id: user.id,
      avatar_file: path.basename(first_avatar_path),
    });

    await updateUserAvatarUseCase.execute({
      user_id: user.id,
      avatar_file: path.basename(second_avatar_path),
    });

    expect(deleteOlderImageFile).toHaveBeenCalled();
  });
});
