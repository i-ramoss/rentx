import request, { Response } from 'supertest';
import { Connection } from 'typeorm';

import { LocalStorageProvider } from '@shared/container/providers/StorageProvider/implementations/LocalStorageProvider';
import { app } from '@shared/infra/http/app';
import { redisClient } from '@shared/infra/http/middlewares/rateLimiter';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

let responseUserToken: Response;

const localStorageProvider = new LocalStorageProvider();

const testFile = `./assets/profile01.jpg`;

describe('Update user avatar', () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    await request(app).post('/users').send({
      name: 'User test',
      email: 'user@test.com.br',
      password: '000',
      driver_license: 'xxxxxxx',
    });

    responseUserToken = await request(app)
      .post('/sessions')
      .send({ email: 'user@test.com.br', password: '000' });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();

    redisClient.quit();
  });

  it('should be able to add a user avatar', async () => {
    const response = await request(app)
      .patch('/users/avatar')
      .set({ Authorization: `Bearer ${responseUserToken.body.token}` })
      .attach('avatar', testFile);

    await localStorageProvider.delete(response.body, 'avatar');

    expect(response.status).toBe(200);
  });
});
