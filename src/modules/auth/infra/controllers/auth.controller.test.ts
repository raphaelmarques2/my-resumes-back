import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import { createAppTester } from 'src/infra/tests/AppTester';
import * as request from 'supertest';

describe('auth.controller', () => {
  const tester = createAppTester();

  describe('POST /auth/signup', () => {
    it('should create new user', async () => {
      const payload = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 6 }),
      };

      const res = await request(tester.server)
        .post('/auth/signup')
        .send(payload);
      expect(res.status).toBe(HttpStatus.CREATED);
      expect(res.body).toEqual(
        expect.objectContaining({
          token: expect.any(String),
          user: expect.objectContaining({
            id: expect.toBeUUID(),
            name: payload.name,
            email: payload.email,
          }),
        }),
      );
    });
    it('should return error when email already exists', async () => {
      const payload = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 6 }),
      };

      const res1 = await request(tester.server)
        .post('/auth/signup')
        .send(payload);
      expect(res1.status).toBe(HttpStatus.CREATED);

      const res2 = await request(tester.server)
        .post('/auth/signup')
        .send(payload);
      expect(res2.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });
  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      const payload = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 6 }),
      };

      const signupRes = await request(tester.server)
        .post('/auth/signup')
        .send(payload);
      expect(signupRes.status).toBe(HttpStatus.CREATED);

      const loginRes = await request(tester.server).post('/auth/login').send({
        email: payload.email,
        password: payload.password,
      });
      expect(loginRes.status).toBe(200);
      expect(loginRes.body).toEqual(
        expect.objectContaining({
          token: expect.any(String),
          user: expect.objectContaining({
            id: expect.toBeUUID(),
            name: payload.name,
            email: payload.email,
          }),
        }),
      );
    });
    it('should fail with invalid credentials ', async () => {
      const payload = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password({ length: 6 }),
      };

      const signupRes = await request(tester.server)
        .post('/auth/signup')
        .send(payload);
      expect(signupRes.status).toBe(HttpStatus.CREATED);

      const loginRes = await request(tester.server).post('/auth/login').send({
        email: payload.email,
        password: 'invalid-password',
      });
      expect(loginRes.status).toBe(HttpStatus.UNAUTHORIZED);
    });
    it('should fail if user does not exist', async () => {
      const loginRes = await request(tester.server).post('/auth/login').send({
        email: 'invalid-email@test.com',
        password: 'invalid-password',
      });
      expect(loginRes.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });
  describe('POST /auth/validate-token', () => {
    it('should validate a valid token', async () => {
      const auth = await tester.signup();

      const validateTokenRes = await request(tester.server)
        .post('/auth/validate-token')
        .set('Authorization', `Bearer ${auth.token}`);

      expect(validateTokenRes.status).toBe(HttpStatus.OK);
    });
    it('should return error with a invalid token', async () => {
      const validateTokenRes = await request(tester.server)
        .post('/auth/validate-token')
        .set('Authorization', `Bearer invalid-token`);

      expect(validateTokenRes.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });
  describe('GET /auth/me', () => {
    it('should return the user', async () => {
      const auth = await tester.signup();

      const meRes = await request(tester.server)
        .get('/auth/me')
        .set('Authorization', `Bearer ${auth.token}`);

      expect(meRes.status).toBe(HttpStatus.OK);
      expect(meRes.body).toEqual(
        expect.objectContaining({
          id: expect.toBeUUID(),
          name: auth.user.name,
          email: auth.user.email,
        }),
      );
    });
  });

  describe('POST /auth/update-password', () => {
    it('should update password', async () => {
      const auth = await tester.signup({ password: 'old-password' });

      const updatePasswordRes = await request(tester.server)
        .post('/auth/update-password')
        .set('Authorization', `Bearer ${auth.token}`)
        .send({
          currentPassword: 'old-password',
          newPassword: 'new-password',
        });

      expect(updatePasswordRes.status).toBe(HttpStatus.OK);

      const loginRes = await request(tester.server).post('/auth/login').send({
        email: auth.user.email,
        password: 'new-password',
      });
      expect(loginRes.status).toBe(200);
    });
  });
});
