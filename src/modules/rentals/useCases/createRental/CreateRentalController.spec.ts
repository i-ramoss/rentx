import { hash } from 'bcryptjs';
import dayjs from 'dayjs';
import request, { Response } from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

let responseAdminUserToken: Response;
let responseCategory: Response;
let responseCar: Response;

let dayAdd24Hours: Date;

describe('Create Rental', () => {
  const carTest: ICreateCarDTO = {
    name: 'Car Test',
    description: 'Car Test description',
    daily_rate: 67,
    license_plate: '',
    fine_amount: 192,
    brand: 'Rosie Collier',
    category_id: '',
  };

  const userTest: ICreateUserDTO = {
    name: 'User Test',
    email: '',
    password: '000',
    driver_license: '',
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

    dayAdd24Hours = dayjs().add(25, 'h').toDate();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able to create a new rental', async () => {
    const response = await request(app)
      .post('/rentals')
      .send({ car_id: `${responseCar.body.id}`, expected_return_date: dayAdd24Hours })
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.refresh_token}` });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.car_id).toEqual(responseCar.body.id);
  });

  it('should not be able to create a new rental if user already has one open', async () => {
    const responseCar02 = await request(app)
      .post('/cars')
      .send({ ...carTest, license_plate: '41402126', category_id: `${responseCategory.body.id}` })
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.refresh_token}` });

    const response = await request(app)
      .post('/rentals')
      .send({ car_id: `${responseCar02.body.id}`, expected_return_date: dayAdd24Hours })
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.refresh_token}` });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'There is a rental in progress for user!' });
  });

  it('should not be able to create a new rental if the car already has one open', async () => {
    await request(app)
      .post('/users')
      .send({ ...userTest, email: 'user_02@test.com', driver_license: '222222' });

    const responseUserToken = await request(app)
      .post('/sessions')
      .send({ email: 'user_02@test.com', password: '000' });

    const response = await request(app)
      .post('/rentals')
      .send({ car_id: `${responseCar.body.id}`, expected_return_date: dayAdd24Hours })
      .set({ Authorization: `Bearer ${responseUserToken.body.refresh_token}` });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'There is a rental in progress for car!' });
  });

  it('should not be able to create a new rental with invalid return time', async () => {
    const responseCar03 = await request(app)
      .post('/cars')
      .send({ ...carTest, license_plate: '76211213', category_id: `${responseCategory.body.id}` })
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.refresh_token}` });

    await request(app)
      .post('/users')
      .send({ ...userTest, email: 'user_03@test.com', driver_license: '333333' });

    const responseUserToken = await request(app)
      .post('/sessions')
      .send({ email: 'user_03@test.com', password: '000' });

    const response = await request(app)
      .post('/rentals')
      .send({
        car_id: `${responseCar03.body.id}`,
        expected_return_date: '2020-08-30T12:48:31.696Z',
      })
      .set({ Authorization: `Bearer ${responseUserToken.body.refresh_token}` });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Invalid return time!' });
  });
});
