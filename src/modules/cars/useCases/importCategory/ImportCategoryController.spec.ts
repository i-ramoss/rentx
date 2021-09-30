import { hash } from 'bcryptjs';
import request, { Response } from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

let responseAdminUserToken: Response;

const csv_file_test = './assets/rentx.csv';

describe('Import categories', () => {
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
  });

  it('should be able to import a csv file of categories and save them into the app', async () => {
    const response = await request(app)
      .post('/categories/import')
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.refresh_token}` })
      .attach('file', csv_file_test);

    expect(response.status).toBe(200);
  });
});
