import { hash } from 'bcryptjs';
import dayjs from 'dayjs';
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

  const carTest02: ICreateCarDTO = {
    name: 'Car Test 02',
    description: 'Car Test 02 description',
    daily_rate: 67,
    license_plate: '07801056',
    fine_amount: 192,
    brand: 'Rosie Collier',
    category_id: '',
  };

  beforeAll(async () => {
    connection = await createConnection();
  });

  beforeEach(async () => {
    await connection.runMigrations();

    const id = uuidV4();
    const id_02 = uuidV4();
    const password = await hash('admin', 8);

    await connection.query(
      `
        INSERT INTO users (id, name, email, password, "isAdmin", created_at, driver_license)
        VALUES ('${id}', 'admin', 'admin@rentx.com.br', '${password}', true, 'now()', 'xxxxxxxx')
      `
    );

    await connection.query(
      `
        INSERT INTO users (id, name, email, password, "isAdmin", created_at, driver_license)
        VALUES ('${id_02}', 'admin_02', 'admin_02@rentx.com.br', '${password}', true, 'now()', 'cccccccc')
      `
    );
  });

  afterEach(async () => {
    await connection.dropDatabase();
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should be able to create a new rental', async () => {
    const dayAdd24Hours = dayjs().add(1, 'day').toDate();

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
      .send({ car_id: `${responseCar.body.id}`, expected_return_date: dayAdd24Hours })
      .set({ Authorization: `Bearer ${responseToken.body.refresh_token}` });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.car_id).toEqual(responseCar.body.id);
  });

  it('should not be able to create a new rental if user already has one open', async () => {
    const dayAdd24Hours = dayjs().add(1, 'day').toDate();

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

    const responseCar02 = await request(app)
      .post('/cars')
      .send({ ...carTest02, category_id: `${responseCategory.body.id}` })
      .set({ Authorization: `Bearer ${responseToken.body.refresh_token}` });

    await request(app)
      .post('/rentals')
      .send({ car_id: `${responseCar02.body.id}`, expected_return_date: dayAdd24Hours })
      .set({ Authorization: `Bearer ${responseToken.body.refresh_token}` });

    const response = await request(app)
      .post('/rentals')
      .send({ car_id: `${responseCar.body.id}`, expected_return_date: dayAdd24Hours })
      .set({ Authorization: `Bearer ${responseToken.body.refresh_token}` });

    expect(response.status).toBe(400);
  });

  it('should not be able to create a new rental if the car already has one open', async () => {
    const dayAdd24Hours = dayjs().add(1, 'day').toDate();

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

    await request(app)
      .post('/rentals')
      .send({ car_id: `${responseCar.body.id}`, expected_return_date: dayAdd24Hours })
      .set({ Authorization: `Bearer ${responseToken.body.refresh_token}` });

    const response = await request(app)
      .post('/rentals')
      .send({ car_id: `${responseCar.body.id}`, expected_return_date: dayAdd24Hours })
      .set({ Authorization: `Bearer ${responseToken.body.refresh_token}` });

    expect(response.status).toBe(400);
  });

  it('should not be able to create a new rental with invalid return time', async () => {
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
      .send({ car_id: `${responseCar.body.id}`, expected_return_date: '2020-08-30T12:48:31.696Z' })
      .set({ Authorization: `Bearer ${responseToken.body.refresh_token}` });

    expect(response.status).toBe(400);
  });
});
