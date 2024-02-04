import { HttpStatus } from '@nestjs/common';
import { createAppTester } from 'src/infra/tests/AppTester';
import * as request from 'supertest';

describe('update-password-request.controller', () => {
  const tester = createAppTester();

  describe('POST /auth/update-password-request', () => {
    it('should create a request', async () => {
      const auth = await tester.signup();

      await request(tester.server)
        .post('/auth/update-password-request')
        .send({ email: auth.user.email })
        .expect(HttpStatus.CREATED);
    });
  });
  describe('GET /auth/update-password-request/:token', () => {
    it('should get the request info using the token', async () => {
      const auth = await tester.signup();

      await request(tester.server)
        .post('/auth/update-password-request')
        .send({ email: auth.user.email })
        .expect(HttpStatus.CREATED);

      const resetRequest = await tester.prisma.resetPasswordRequest.findFirst({
        where: { userId: auth.user.id },
      });

      const res = await request(tester.server).get(
        `/auth/update-password-request/${resetRequest?.token}`,
      );
      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toEqual(
        expect.objectContaining({
          email: auth.user.email,
        }),
      );
    });
  });
  describe('POST /auth/update-password-request/:token/update-password', () => {
    it('should update the password', async () => {
      const auth = await tester.signup();

      await request(tester.server)
        .post('/auth/update-password-request')
        .send({ email: auth.user.email })
        .expect(HttpStatus.CREATED);

      const resetRequest = await tester.prisma.resetPasswordRequest.findFirst({
        where: { userId: auth.user.id },
      });
      expect(resetRequest?.token).toBeDefined();

      const updateRes = await request(tester.server)
        .post(
          `/auth/update-password-request/${resetRequest?.token}/update-password`,
        )
        .send({ password: 'new-password' });

      expect(updateRes.status).toBe(HttpStatus.OK);

      const loginRes = await request(tester.server).post('/auth/login').send({
        email: auth.user.email,
        password: 'new-password',
      });
      expect(loginRes.status).toBe(HttpStatus.OK);
    });
  });
});
