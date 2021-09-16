import { hash } from 'bcryptjs';
import request, { Response } from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

let responseAdminUserToken: Response;
let responseCategory: Response;
let responseCar: Response;
let responseSpecification: Response;

describe('Create car specification', () => {
  const carTest: ICreateCarDTO = {
    name: 'Car Test',
    description: 'Car test description',
    daily_rate: 150,
    license_plate: '',
    fine_amount: 20,
    brand: 'Car test brand',
    category_id: '',
  };

  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash('admin', 8);

    await connection.query(
      `
        INSERT INTO users(id, name, email, password, "isAdmin", created_at, driver_license)
        VALUES('${id}', 'admin', 'admin@rentx.com.br', '${password}', 'true', 'now()', 'xxxxxxx')
      `
    );

    responseAdminUserToken = await request(app)
      .post('/sessions')
      .send({ email: 'admin@rentx.com.br', password: 'admin' });

    responseCategory = await request(app)
      .post('/categories')
      .send({ name: 'Category Supertest', description: 'Category Supertest description' })
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.refresh_token}` });

    responseCar = await request(app)
      .post('/cars')
      .send({ ...carTest, license_plate: '57788935', category_id: responseCategory.body.id })
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.refresh_token}` });

    responseSpecification = await request(app)
      .post('/specifications')
      .send({ name: 'Specification Test', description: 'Specification Test description' })
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.refresh_token}` });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to add a spec to the car', async () => {
    const response = await request(app)
      .patch(`/cars/specifications/${responseCar.body.id}`)
      .send({ specifications_id: [responseSpecification.body.id] })
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.refresh_token}` });

    expect(response.status).toBe(200);
  });
});
