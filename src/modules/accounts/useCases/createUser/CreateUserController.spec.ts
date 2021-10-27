import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '@shared/infra/http/app';
import { redisClient } from '@shared/infra/http/middlewares/rateLimiter';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('Create user', () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();

    redisClient.quit();
  });

  it('should be able to create a new user', async () => {
    const response = await request(app).post('/users').send({
      name: 'User test',
      email: 'user_test@rentx.com.br',
      password: '000',
      driver_license: 'xxxxxxx',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to create a new user with existing email', async () => {
    const response = await request(app).post('/users').send({
      name: 'User test',
      email: 'user_test@rentx.com.br',
      password: '000',
      driver_license: 'xxxxxxx',
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'User already exists!' });
  });
});
