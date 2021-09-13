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

describe('Create a car', () => {
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
        VALUES('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'now()', 'xxxxxxx')
      `
    );

    responseAdminUserToken = await request(app).post('/sessions').send({
      email: 'admin@rentx.com.br',
      password: 'admin',
    });

    responseCategory = await request(app)
      .post('/categories')
      .send({ name: 'Category Supertest', description: 'Category Supertest description' })
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.refresh_token}` });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create a new car', async () => {
    const response = await request(app)
      .post('/cars')
      .send({ ...carTest, license_plate: '12464388', category_id: responseCategory.body.id })
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.refresh_token}` });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.category_id).toEqual(responseCategory.body.id);
  });

  it('should not be able to create an existing car, with the same license_plate', async () => {
    const response = await request(app)
      .post('/cars')
      .send({ ...carTest, license_plate: '12464388', category_id: responseCategory.body.id })
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.refresh_token}` });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Car already exists!' });
  });

  it('should be able to create a car with available as true by default', async () => {
    const response = await request(app)
      .post('/cars')
      .send({ ...carTest, license_plate: '96051555', category_id: responseCategory.body.id })
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.refresh_token}` });

    expect(response.body.available).toBe(true);
  });
});
