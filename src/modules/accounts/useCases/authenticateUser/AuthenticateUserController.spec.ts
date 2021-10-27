import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '@shared/infra/http/app';
import { redisClient } from '@shared/infra/http/middlewares/rateLimiter';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('Authenticate user', () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    await request(app).post('/users').send({
      name: 'Flora Ramos',
      email: 'flora_ramos@rentx.com.br',
      password: '000',
      driver_license: 'xxxxxxx',
    });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();

    redisClient.quit();
  });

  it('should be able to authenticate an user', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({ email: 'flora_ramos@rentx.com.br', password: '000' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('refresh_token');
  });

  it('should not be able to authenticate a non-existent user', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({ email: 'incorrectEmail', password: '000' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Email or password incorrect!' });
  });

  it('should not be able to authenticate an user with incorrect password', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({ email: 'flora_ramos@rentx.com.br', password: 'incorrectPassword' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Email or password incorrect!' });
  });
});
