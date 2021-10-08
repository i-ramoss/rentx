import { sign } from 'jsonwebtoken';
import request, { Response } from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import auth from '@config/auth';
import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

let responseUserToken: Response;

describe('Refresh token', () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    await request(app).post('/users').send({
      name: 'User Test',
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

  it('should be able to create a refresh token for user by request body', async () => {
    const response = await request(app)
      .post('/refresh-token')
      .send({ token: responseUserToken.body.refresh_token });

    expect(response.status).toBe(200);
    expect(typeof response.body).toBe('object');
  });

  it('should be able to create a refresh token for user by request query', async () => {
    const response = await request(app)
      .post('/refresh-token')
      .query({ token: responseUserToken.body.refresh_token });

    expect(response.status).toBe(200);
    expect(typeof response.body).toBe('object');
  });

  it('should be able to create a refresh token for user by request header', async () => {
    const response = await request(app)
      .post('/refresh-token')
      .set('x-access-token', responseUserToken.body.refresh_token);

    expect(response.status).toBe(200);
    expect(typeof response.body).toBe('object');
  });

  it('should not be able to create a refresh token for a invalid user token', async () => {
    const invalidToken = sign({}, auth.secret_refresh_token, {
      subject: uuidV4(),
      expiresIn: auth.expires_in_refresh_token,
    });

    const response = await request(app).post('/refresh-token').send({ token: invalidToken });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Refresh Token does not exists!' });
  });
});
