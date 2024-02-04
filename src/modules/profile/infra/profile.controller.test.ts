import { HttpStatus } from '@nestjs/common';
import { createAppTester } from 'src/infra/tests/AppTester';
import * as request from 'supertest';
import { UpdateProfileDto } from '../application/use-cases/update-profile/UpdateProfileDto';
import { ProfileDto } from '../application/entities/ProfileDto';

describe('profile.controller', () => {
  const tester = createAppTester();

  describe('GET /profile', () => {
    it('should return profile by user id with the same user name and email', async () => {
      const auth = await tester.signup();
      const res = await request(tester.server)
        .get('/profile')
        .set('Authorization', `Bearer ${auth.token}`)
        .send();

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toEqual({
        id: expect.toBeUUID(),
        name: auth.user.name,
        email: auth.user.email,
        userId: auth.user.id,
      });
    });
  });
  describe('PATCH /profiles/:id', () => {
    it('should update profile', async () => {
      const auth = await tester.signup();

      const payload: UpdateProfileDto = {
        name: 'New Name',
        email: 'new-email@test.com',
        address: 'New Address',
        linkedin: 'New Linkedin',
      };

      const profileRes = await request(tester.server)
        .get('/profile')
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(profileRes.status).toBe(HttpStatus.OK);
      const profile: ProfileDto = profileRes.body;

      const patchRes = await request(tester.server)
        .patch(`/profiles/${profile.id}`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send(payload);
      expect(patchRes.status).toBe(HttpStatus.OK);

      const getRes = await request(tester.server)
        .get('/profile')
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(getRes.status).toBe(HttpStatus.OK);
      expect(getRes.body).toEqual({
        id: expect.toBeUUID(),
        name: payload.name,
        email: payload.email,
        address: payload.address,
        linkedin: payload.linkedin,
        userId: auth.user.id,
      });
    });
  });
});
