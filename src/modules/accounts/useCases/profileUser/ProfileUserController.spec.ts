import request, { Response } from 'supertest';
import { Connection } from 'typeorm';

import { app } from '@shared/infra/http/app';
import { redisClient } from '@shared/infra/http/middlewares/rateLimiter';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

let responseUser: Response;
let responseUserToken: Response;

describe('User profile', () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    responseUser = await request(app).post('/users').send({
      name: 'Flora Ramos',
      email: 'flora_ramos@rentx.com.br',
      password: '000',
      driver_license: 'xxxxxxxx',
    });

    responseUserToken = await request(app)
      .post('/sessions')
      .send({ email: 'flora_ramos@rentx.com.br', password: '000' });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();

    redisClient.quit();
  });

  it('should be able to show the user profile', async () => {
    const response = await request(app)
      .get('/users/profile')
      .set({ Authorization: `Bearer ${responseUserToken.body.token}` });

    expect(response.body.name).toEqual(responseUser.body.name);
    expect(response.body.email).toEqual(responseUser.body.email);
    expect(response.body.driver_license).toEqual(responseUser.body.driver_license);
    expect(typeof response.body).toBe('object');
  });
});
