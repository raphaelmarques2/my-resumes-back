import { HttpStatus } from '@nestjs/common';
import { createAppTester } from 'src/infra/tests/AppTester';
import * as request from 'supertest';
import { ExperienceDto } from '../application/entities/ExperienceDto';
import { UpdateExperienceDto } from '../application/use-cases/update-experience/UpdateExperienceDto';
import { faker } from '@faker-js/faker';

describe('experience.controller', () => {
  const tester = createAppTester();

  describe('POST /experiences', () => {
    it('should create a new experience', async () => {
      const auth = await tester.signup();

      const res = await request(tester.server)
        .post('/experiences')
        .set('Authorization', `Bearer ${auth.token}`)
        .send();

      expect(res.status).toBe(HttpStatus.CREATED);
      expect(res.body).toEqual({
        id: expect.toBeUUID(),
        title: 'Title',
        company: 'Company',
        description: '',
        userId: auth.user.id,
      });
    });
  });
  describe('GET /experiences/:id', () => {
    it('should return experience by id', async () => {
      const auth = await tester.signup();

      const addRes = await request(tester.server)
        .post('/experiences')
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(addRes.status).toBe(HttpStatus.CREATED);
      const experience: ExperienceDto = addRes.body;

      const res = await request(tester.server)
        .get(`/experiences/${experience.id}`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toEqual({
        id: experience.id,
        title: experience.title,
        company: experience.company,
        description: experience.description,
        userId: experience.userId,
      });
    });
  });
  describe('GET /experiences', () => {
    it('should return an empty list', async () => {
      const auth = await tester.signup();

      const res = await request(tester.server)
        .get(`/experiences`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toHaveLength(0);
    });
    it('should return a list of experiences', async () => {
      const auth = await tester.signup();

      for (let i = 0; i < 3; i++) {
        await request(tester.server)
          .post('/experiences')
          .set('Authorization', `Bearer ${auth.token}`)
          .send();
      }

      const res = await request(tester.server)
        .get(`/experiences`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toHaveLength(3);
    });
  });
  describe('PATCH /experiences/:id', () => {
    it('should update experience by id', async () => {
      const auth = await tester.signup();

      const addRes = await request(tester.server)
        .post('/experiences')
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(addRes.status).toBe(HttpStatus.CREATED);
      const experience: ExperienceDto = addRes.body;

      const payload: UpdateExperienceDto = {
        title: 'New title',
        company: 'New company',
        description: 'New description',
        startDate: faker.date.past().toISOString(),
        endDate: faker.date.past().toISOString(),
      };

      const res = await request(tester.server)
        .patch(`/experiences/${experience.id}`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send(payload);
      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toEqual({
        id: experience.id,
        title: payload.title,
        company: payload.company,
        description: payload.description,
        userId: experience.userId,
        startDate: payload.startDate,
        endDate: payload.endDate,
      });
    });
  });
  describe('DELETE /experiences/:id', () => {
    it('should delete experience by id', async () => {
      const auth = await tester.signup();

      const addRes = await request(tester.server)
        .post('/experiences')
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(addRes.status).toBe(HttpStatus.CREATED);
      const experience: ExperienceDto = addRes.body;

      const res = await request(tester.server)
        .delete(`/experiences/${experience.id}`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(res.status).toBe(HttpStatus.OK);

      const listRes = await request(tester.server)
        .get(`/experiences`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(listRes.status).toBe(HttpStatus.OK);
      expect(listRes.body).toHaveLength(0);
    });
  });
});
