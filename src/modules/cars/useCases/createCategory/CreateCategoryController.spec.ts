import request from 'supertest';

import { app } from '@shared/infra/http/app';

describe('Create Category Controller', () => {
  // passaremos o app dentro da requisição

  it('test', async () => {
    await request(app).get('/cars/available').expect(200);
  });
});
