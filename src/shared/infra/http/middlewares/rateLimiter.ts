import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from 'redis';

import { AppError } from '@shared/errors/AppError';

// criar o client
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,

  // a porta precisa ser  um número
  port: Number(process.env.REDIS_PORT),
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rateLimiter',

  // quantas requisições iremos permitir por segundo (10/s)
  points: 10,
  duration: 5,
});

export async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    // request.ip - vamos verificar qual é o ip do usuário que está realizando a requisição e vamos validá-lo
    await limiter.consume(request.ip);

    next();
  } catch (err) {
    // se a quantidade de requisições por segundo já tiver sido atingida vamos retornar um erro
    // o código já definido para um número excessivo de requisições é o 429
    throw new AppError('Too many requests', 429);
  }
}
