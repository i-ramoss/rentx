import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { UsersRepository } from '../modules/accounts/repositories/implementations/UsersRepository';

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) throw new Error('Token missing');

  const [, token] = authHeader.split(' ');

  try {
    const { sub: user_id } = verify(
      token,
      '466101563dd1246815f434cce7a38f73'
    ) as IPayload;

    const usersRepository = new UsersRepository();

    const user = usersRepository.findById(user_id);

    if (!user) throw new Error('User does not exists!');

    next();
  } catch {
    throw new Error('Invalid token');
  }
}
