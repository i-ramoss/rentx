import { hash } from 'bcryptjs';
import request, { Response } from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { app } from '@shared/infra/http/app';
import { redisClient } from '@shared/infra/http/middlewares/rateLimiter';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

let responseAdminUserToken: Response;

describe('List Categories', () => {
  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash('admin', 8);

    await connection.query(
      `
        INSERT INTO users(id, name, email, password, "isAdmin", created_at, driver_license)
        values('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'now()', 'xxxxxx')
      `
    );

    responseAdminUserToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();

    redisClient.quit();
  });

  it('should be able to list all registered categories', async () => {
    await request(app)
      .post('/categories')
      .send({ name: 'Category Supertest', description: 'Category Supertest description' })
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.token}` });

    const response = await request(app).get('/categories');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0].name).toEqual('Category Supertest');
  });
});
