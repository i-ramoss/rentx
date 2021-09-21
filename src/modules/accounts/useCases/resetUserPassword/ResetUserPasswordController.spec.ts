import dayjs from 'dayjs';
import { sign } from 'jsonwebtoken';
import request, { Response } from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import auth from '@config/auth';
import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

let responseUserToken: Response;

describe('Reset user password', () => {
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
  });

  it('should be able to reset an user password', async () => {
    const response = await request(app)
      .post(`/password/reset?token=${responseUserToken.body.refresh_token}`)
      .send({ password: 'new-password' });

    expect(response.status).toBe(200);
  });

  it('should not be able to reset a password for an invalid token', async () => {
    const invalidToken = sign({}, auth.secret_refresh_token, {
      subject: uuidV4(),
      expiresIn: auth.expires_in_refresh_token,
    });

    const response = await request(app).post(`/password/reset?token=${invalidToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Invalid Token!' });
  });

  it('should not be able to reset a password for an user expired token', async () => {
    responseUserToken = await request(app)
      .post('/sessions')
      .send({ email: 'user@test.com.br', password: 'new-password' });

    const response = await request(app)
      .post(`/password/reset?token=${responseUserToken.body.refresh_token}`)
      .send({ password: 'password', date_now: dayjs().add(100, 'days').toDate() });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Token expired' });
  });
});
