import * as request from 'supertest';
import { createAppTester } from '../tests/AppTester';

describe('AppController', () => {
  const tester = createAppTester();

  it('/ (GET)', async () => {
    return request(tester.server).get('/').expect(200).expect('ok');
  });

  it('/health (GET)', async () => {
    return request(tester.server).get('/health').expect(200).expect('ok');
  });
});
