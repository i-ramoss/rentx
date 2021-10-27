import { hash } from 'bcryptjs';
import request, { Response } from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { app } from '@shared/infra/http/app';
import { redisClient } from '@shared/infra/http/middlewares/rateLimiter';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

let responseAdminUserToken: Response;
let responseCategory: Response;

describe('List Available Cars', () => {
  const carTest: ICreateCarDTO = {
    name: '',
    description: 'Car test description',
    daily_rate: 150,
    license_plate: '',
    fine_amount: 300,
    brand: 'Audi',
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

    responseAdminUserToken = await request(app)
      .post('/sessions')
      .send({ email: 'admin@rentx.com.br', password: 'admin' });

    responseCategory = await request(app)
      .post('/categories')
      .send({ name: 'Category Test', description: 'Category Test description' })
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.token}` });

    await request(app)
      .post('/cars')
      .send({
        ...carTest,
        name: 'Audi A1',
        license_plate: '98568211',
        category_id: `${responseCategory.body.id}`,
      })
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.token}` });

    await request(app)
      .post('/cars')
      .send({
        ...carTest,
        name: 'Audi A2',
        license_plate: '30297279',
        category_id: `${responseCategory.body.id}`,
      })
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.token}` });

    await request(app)
      .post('/cars')
      .send({
        ...carTest,
        name: 'Audi A3',
        license_plate: '19511951',
        category_id: `${responseCategory.body.id}`,
      })
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.token}` });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();

    redisClient.quit();
  });

  it('should be able to list all available cars', async () => {
    const response = await request(app).get('/cars/available');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);
  });

  it('should be able to list all available cars by name', async () => {
    const response = await request(app).get('/cars/available').query({ name: 'Audi A1' });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Audi A1' })])
    );
  });

  it('should be able to list all available cars by brand', async () => {
    const response = await request(app).get('/cars/available').query({ brand: 'Audi' });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);
    expect(response.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ brand: 'Audi' })])
    );
  });

  it('should be able to list all available cars by category id', async () => {
    const response = await request(app)
      .get('/cars/available')
      .query({ category_id: `${responseCategory.body.id}` });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ category_id: `${responseCategory.body.id}` }),
      ])
    );
  });
});
