import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO';
import { UserTokens } from '@modules/accounts/infra/typeorm/entities/UserTokens';

interface IUsersTokensRepository {
  create({ refresh_token, user_id, expires_date }: ICreateUserTokenDTO): Promise<UserTokens>;
}

export { IUsersTokensRepository };
