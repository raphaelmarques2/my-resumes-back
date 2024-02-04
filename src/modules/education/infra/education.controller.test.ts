import { HttpStatus } from '@nestjs/common';
import { createAppTester } from 'src/infra/tests/AppTester';
import * as request from 'supertest';
import { EducationDto } from '../application/entities/EducationDto';
import { faker } from '@faker-js/faker';
import { UpdateEducationDto } from '../application/use-cases/update-education/UpdateEducationDto';

describe('education.controller', () => {
  const tester = createAppTester();

  describe('POST /educations', () => {
    it('should create a new education', async () => {
      const auth = await tester.signup();

      const res = await request(tester.server)
        .post('/educations')
        .set('Authorization', `Bearer ${auth.token}`)
        .send();

      expect(res.status).toBe(HttpStatus.CREATED);
      expect(res.body).toEqual({
        id: expect.toBeUUID(),
        title: 'Title',
        institution: 'Institution',
        startDate: undefined,
        endDate: undefined,
        userId: auth.user.id,
      });
    });
  });
  describe('GET /educations/:id', () => {
    it('should return education by id', async () => {
      const auth = await tester.signup();

      const addRes = await request(tester.server)
        .post('/educations')
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(addRes.status).toBe(HttpStatus.CREATED);

      const education: EducationDto = addRes.body;

      const res = await request(tester.server)
        .get(`/educations/${education.id}`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send();

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toEqual(
        expect.objectContaining({
          id: education.id,
        }),
      );
    });
  });
  describe('GET /educations', () => {
    it('should return an empty list', async () => {
      const auth = await tester.signup();

      const res = await request(tester.server)
        .get('/educations')
        .set('Authorization', `Bearer ${auth.token}`)
        .send();

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toEqual([]);
    });
    it('should return all educations', async () => {
      const auth = await tester.signup();

      //add 3 educations
      for (let i = 0; i < 3; i++) {
        await request(tester.server)
          .post('/educations')
          .set('Authorization', `Bearer ${auth.token}`)
          .send();
      }

      const res = await request(tester.server)
        .get('/educations')
        .set('Authorization', `Bearer ${auth.token}`)
        .send();

      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toHaveLength(3);
    });
  });
  describe('PATCH /educations/:id', () => {
    it('should update education by id', async () => {
      const auth = await tester.signup();

      const addRes = await request(tester.server)
        .post('/educations')
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(addRes.status).toBe(HttpStatus.CREATED);

      const education: EducationDto = addRes.body;

      const payload: UpdateEducationDto = {
        title: 'New title',
        institution: 'New institution',
        startDate: faker.date.past().toISOString(),
        endDate: faker.date.past().toISOString(),
      };

      const patchRes = await request(tester.server)
        .patch(`/educations/${education.id}`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send(payload);
      expect(patchRes.status).toBe(HttpStatus.OK);
      expect(patchRes.body).toEqual(
        expect.objectContaining({
          id: education.id,
          title: payload.title,
          institution: payload.institution,
          startDate: payload.startDate,
          endDate: payload.endDate,
        }),
      );
    });
  });
  describe('DELETE /educations/:id', () => {
    it('should delete education by id', async () => {
      const auth = await tester.signup();

      const addRes = await request(tester.server)
        .post('/educations')
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(addRes.status).toBe(HttpStatus.CREATED);

      const education: EducationDto = addRes.body;

      const res = await request(tester.server)
        .delete(`/educations/${education.id}`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send();

      expect(res.status).toBe(HttpStatus.OK);

      const listRes = await request(tester.server)
        .get('/educations')
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(listRes.status).toBe(HttpStatus.OK);
      expect(listRes.body).toEqual([]);
    });
  });
});
