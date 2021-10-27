import { hash } from 'bcryptjs';
import dayjs from 'dayjs';
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
let responseCar: Response;
let responseRental: Response;

describe('List rentals by user', () => {
  const carTest: ICreateCarDTO = {
    name: 'Car Test',
    description: 'Car Test description',
    daily_rate: 67,
    license_plate: '',
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

    const dayAdd24Hours = dayjs().add(25, 'h').toDate();

    responseAdminUserToken = await request(app)
      .post('/sessions')
      .send({ email: 'admin@rentx.com.br', password: 'admin' });

    responseCategory = await request(app)
      .post('/categories')
      .send({ name: 'Category Supertest', description: 'Category Supertest description' })
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.token}` });

    responseCar = await request(app)
      .post('/cars')
      .send({ ...carTest, license_plate: '81062954', category_id: `${responseCategory.body.id}` })
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.token}` });

    responseRental = await request(app)
      .post('/rentals')
      .send({ car_id: responseCar.body.id, expected_return_date: dayAdd24Hours })
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.token}` });

    await request(app)
      .post(`/rentals/devolution/${responseRental.body.id}`)
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.token}` });

    await request(app)
      .post('/rentals')
      .send({ car_id: responseCar.body.id, expected_return_date: dayAdd24Hours })
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.token}` });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();

    redisClient.quit();
  });

  it('should be able to list all rentals by an user', async () => {
    const response = await request(app)
      .get('/rentals/user')
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.token}` });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ car_id: responseCar.body.id })])
    );
    expect(response.body.length).toBe(2);
  });
});
