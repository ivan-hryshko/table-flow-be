import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import supertest, * as request from 'supertest';

import { AppModule } from '../../src/app.module';

describe('TableController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/v1/tables (POST), unauthorized, ', () => {
    return request(app.getHttpServer()).post('/api/v1/table').expect(401);
  });

  it('/api/v1/tables (POST), unauthorized, ', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/v1/users/login',
    );
    console.log('response :>> ', response.body);
    authToken = response.body.token;
    console.log('authToken :>> ', authToken);
    return request(app.getHttpServer())
      .post('/api/v1/table')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(401);
  });
});
