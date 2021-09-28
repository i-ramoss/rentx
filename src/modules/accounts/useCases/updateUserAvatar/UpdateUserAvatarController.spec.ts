import request, { Response } from 'supertest';
import { Connection } from 'typeorm';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';
import { fileMethods } from '@utils/file';

let connection: Connection;

let responseUserToken: Response;

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
  });

  it('should be able to add a user avatar', async () => {
    const response = await request(app)
      .patch('/users/avatar')
      .set({ Authorization: `Bearer ${responseUserToken.body.refresh_token}` })
      .attach('avatar', testFile);

    await fileMethods.deleteFile(`./tmp/avatar/${response.body}`);

    expect(response.status).toBe(200);
  });
});
