import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('Send forgot password mail', () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    await request(app).post('/users').send({
      name: 'User test',
      email: 'user_test@rentx.com.br',
      password: '000',
      driver_license: 'xxxxxxxx',
    });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to send a forgot password mail to the user', async () => {
    const response = await request(app)
      .post('/password/forgot')
      .send({ email: 'user_test@rentx.com.br' });

    expect(response.status).toBe(200);
  });
});
