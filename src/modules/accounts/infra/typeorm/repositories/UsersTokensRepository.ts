import { Repository, getRepository } from 'typeorm';

import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';

import { UserToken } from '../entities/UserTokens';

class UsersTokensRepository implements IUsersTokensRepository {
  private repository: Repository<UserToken>;

  constructor() {
    this.repository = getRepository(UserToken);
  }

  async create({ refresh_token, user_id, expires_date }: ICreateUserTokenDTO): Promise<UserToken> {
    const userToken = this.repository.create({
      refresh_token,
      user_id,
      expires_date,
    });

    await this.repository.save(userToken);

    return userToken;
  }

  async findByUserIdAndRefreshToken(user_id: string, refresh_token: string): Promise<UserToken> {
    return this.repository.findOne({ user_id, refresh_token });
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByRefreshToken(refresh_token: string): Promise<UserToken> {
    return this.repository.findOne({ refresh_token });
  }
}

export { UsersTokensRepository };
