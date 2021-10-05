import { hash } from 'bcryptjs';
import dayjs from 'dayjs';
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
let responseRental: Response;

let dayAdd24Hours: Date;
let dayBeforeYesterday: Date;
let yesterday: Date;

describe('Devolution a Rental', () => {
  const carTest: ICreateCarDTO = {
    name: 'Car Test',
    description: 'Car Test description',
    daily_rate: 50,
    license_plate: '',
    fine_amount: 100,
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
        INSERT INTO users(id, name, email, password, "isAdmin", created_at, driver_license)
        VALUES('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'now()', 'xxxxxx')
      `
    );

    dayAdd24Hours = dayjs().add(25, 'h').toDate();
    dayBeforeYesterday = dayjs().subtract(2, 'day').toDate();
    yesterday = dayjs().subtract(1, 'day').toDate();

    responseAdminUserToken = await request(app)
      .post('/sessions')
      .send({ email: 'admin@rentx.com.br', password: 'admin' });

    responseCategory = await request(app)
      .post('/categories')
      .send({ name: 'Category Supertest', description: 'Category Supertest description' })
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.refresh_token}` });

    responseCar = await request(app)
      .post('/cars')
      .send({ ...carTest, license_plate: '81062954', category_id: `${responseCategory.body.id}` })
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.refresh_token}` });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to return a rent', async () => {
    responseRental = await request(app)
      .post('/rentals')
      .send({ car_id: responseCar.body.id, expected_return_date: dayAdd24Hours })
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.refresh_token}` });

    const response = await request(app)
      .post(`/rentals/devolution/${responseRental.body.id}`)
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.refresh_token}` });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('end_date');
    expect(response.body.total).toBe(50);
    expect(responseCar.body.available).toBe(true);
  });

  it('should not be able to return a non-existent rent', async () => {
    const response = await request(app)
      .post(`/rentals/devolution/${uuidV4()}`)
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.refresh_token}` });

    expect(response.body).toEqual({ message: 'Rental not found!' });
    expect(response.status).toBe(400);
  });

  it('should be able to apply a late fee when returning a rental', async () => {
    responseRental = await request(app)
      .post('/rentals')
      .send({
        car_id: responseCar.body.id,
        expected_return_date: yesterday,
        start_date: dayBeforeYesterday,
      })
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.refresh_token}` });

    const response = await request(app)
      .post(`/rentals/devolution/${responseRental.body.id}`)
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.refresh_token}` });

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(200);
  });
});
