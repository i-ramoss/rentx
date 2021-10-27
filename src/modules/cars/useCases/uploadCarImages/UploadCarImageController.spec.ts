import { hash } from 'bcryptjs';
import request, { Response } from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { LocalStorageProvider } from '@shared/container/providers/StorageProvider/implementations/LocalStorageProvider';
import { app } from '@shared/infra/http/app';
import { redisClient } from '@shared/infra/http/middlewares/rateLimiter';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

let responseAdminUserToken: Response;
let responseCategory: Response;
let responseCar: Response;

const carImage01 = `./assets/car_image01.jpg`;
const carImage02 = `./assets/car_image02.jpg`;

const localStorageProvider = new LocalStorageProvider();

describe('Upload car images', () => {
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

    responseCar = await request(app)
      .post('/cars')
      .send({
        ...carTest,
        name: 'Audi A1',
        license_plate: '98568211',
        category_id: `${responseCategory.body.id}`,
      })
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.token}` });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();

    redisClient.quit();
  });

  it('should be able to upload some images to a car', async () => {
    const response = await request(app)
      .post(`/cars/images/${responseCar.body.id}`)
      .set({ Authorization: `Bearer ${responseAdminUserToken.body.token}` })
      .attach('images', carImage01)
      .attach('images', carImage02);

    await Promise.all(
      response.body.map(async (image: string) => {
        await localStorageProvider.delete(image, 'cars');
      })
    );

    expect(response.status).toBe(201);
  });
});
