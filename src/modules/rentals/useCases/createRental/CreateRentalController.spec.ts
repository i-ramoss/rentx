import { hash } from 'bcryptjs';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('Create Rental', () => {
  const carTest: ICreateCarDTO = {
    name: 'Car Test',
    description: 'Car Test description',
    daily_rate: 67,
    license_plate: '82448975',
    fine_amount: 192,
    brand: 'Rosie Collier',
    category_id: '',
  };

  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash('admin', 8);

    await connection.query(
      `
        INSERT INTO users (id, name, email, password, "isAdmin", created_at, driver_license)
        VALUES ('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'now()', 'xxxxxxxx')
      `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create a new rental', async () => {
    const responseToken = await request(app)
      .post('/sessions')
      .send({ email: 'admin@rentx.com.br', password: 'admin' });

    const responseCategory = await request(app)
      .post('/categories')
      .send({ name: 'Category Supertest', description: 'Category Supertest description' })
      .set({ Authorization: `Bearer ${responseToken.body.refresh_token}` });

    const responseCar = await request(app)
      .post('/cars')
      .send({ ...carTest, category_id: `${responseCategory.body.id}` })
      .set({ Authorization: `Bearer ${responseToken.body.refresh_token}` });

    const response = await request(app)
      .post('/rentals')
      .send({ car_id: `${responseCar.body.id}`, expected_return_date: '2021-09-30T12:48:31.696Z' })
      .set({ Authorization: `Bearer ${responseToken.body.refresh_token}` });

    expect(response.status).toBe(201);
  });
});
