import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO';
import { UserToken } from '@modules/accounts/infra/typeorm/entities/UserTokens';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';

class UsersTokensRepositoryInMemory implements IUsersTokensRepository {
  userTokens: UserToken[] = [];

  async create({ refresh_token, user_id, expires_date }: ICreateUserTokenDTO): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      refresh_token,
      user_id,
      expires_date,
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  async findByUserIdAndRefreshToken(user_id: string, refresh_token: string): Promise<UserToken> {
    return this.userTokens.find(
      token => token.user_id === user_id && token.refresh_token === refresh_token
    );
  }

  async deleteById(id: string): Promise<void> {
    const userToken = this.userTokens.find(token => token.id === id);

    this.userTokens.splice(this.userTokens.indexOf(userToken));
  }

  async findByRefreshToken(refresh_token: string): Promise<UserToken> {
    return this.userTokens.find(token => token.refresh_token === refresh_token);
  }
}

export { UsersTokensRepositoryInMemory };
