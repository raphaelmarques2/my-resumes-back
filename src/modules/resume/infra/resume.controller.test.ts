import { HttpStatus } from '@nestjs/common';
import { createAppTester } from 'src/infra/tests/AppTester';
import * as request from 'supertest';
import { UpdateResumeDto } from '../application/use-cases/update-resume/UpdateResumeDto';
import { ResumeDto } from '../application/entities/ResumeDto';
import { ExperienceDto } from 'src/modules/experience/application/entities/ExperienceDto';
import { EducationDto } from 'src/modules/education/application/entities/EducationDto';
import { CreateResumeExampleUseCase } from '../application/use-cases/create-resume-example/create-resume-example.usecase';

describe('resume.controller', () => {
  const tester = createAppTester();

  describe('POST /resumes', () => {
    it('should create a new resume', async () => {
      const auth = await tester.signup();

      const res = await request(tester.server)
        .post('/resumes')
        .set('Authorization', `Bearer ${auth.token}`)
        .send();

      expect(res.status).toBe(HttpStatus.CREATED);
      expect(res.body).toEqual({
        id: expect.toBeUUID(),
        name: 'Name',
        title: 'Title',
        description: '',
        experiences: [],
        educations: [],
        userId: auth.user.id,
        updatedAt: expect.toBeIsoDate(),
      });
    });
  });
  describe('GET /resumes/:id', () => {
    it('should return a resume by id', async () => {
      const auth = await tester.signup();

      const addRes = await request(tester.server)
        .post('/resumes')
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(addRes.status).toBe(HttpStatus.CREATED);
      const resume = addRes.body;

      const res = await request(tester.server)
        .get(`/resumes/${resume.id}`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toEqual({
        id: resume.id,
        name: resume.name,
        title: resume.title,
        description: resume.description,
        experiences: resume.experiences,
        educations: resume.educations,
        userId: resume.userId,
        updatedAt: expect.toBeIsoDate(),
      });
    });
  });
  describe('GET /resumes', () => {
    it('should return an empty list of resumes', async () => {
      const auth = await tester.signup();

      const res = await request(tester.server)
        .get(`/resumes`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toHaveLength(0);
    });
    it('should return a list of resumes', async () => {
      const auth = await tester.signup();

      for (let i = 0; i < 3; i++) {
        await request(tester.server)
          .post('/resumes')
          .set('Authorization', `Bearer ${auth.token}`)
          .send();
      }

      const res = await request(tester.server)
        .get(`/resumes`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(res.status).toBe(HttpStatus.OK);
      expect(res.body).toHaveLength(3);
    });
  });
  describe('PATCH /resumes/:id', () => {
    it('should update a resume', async () => {
      const auth = await tester.signup();

      const addRes = await request(tester.server)
        .post('/resumes')
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(addRes.status).toBe(HttpStatus.CREATED);
      const resume = addRes.body;

      const payload: UpdateResumeDto = {
        name: 'New Name',
        title: 'New Title',
        description: 'New Description',
      };

      const patchRes = await request(tester.server)
        .patch(`/resumes/${resume.id}`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send(payload);
      expect(patchRes.status).toBe(HttpStatus.OK);
      expect(patchRes.body).toEqual(
        expect.objectContaining({
          name: payload.name,
          title: payload.title,
          description: payload.description,
        }),
      );
    });
    it('should update a resume changing experiences', async () => {
      const auth = await tester.signup();

      const { body: resume }: { body: ResumeDto } = await request(tester.server)
        .post('/resumes')
        .set('Authorization', `Bearer ${auth.token}`)
        .send();

      const experiences = await Promise.all(
        Array.from({ length: 3 }).map(async () => {
          const { body: resume }: { body: ExperienceDto } = await request(
            tester.server,
          )
            .post('/experiences')
            .set('Authorization', `Bearer ${auth.token}`)
            .send();
          return resume.id;
        }),
      );

      //set all experiences
      const payload1 = { experiences };
      const patchRes1 = await request(tester.server)
        .patch(`/resumes/${resume.id}`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send(payload1);
      expect(patchRes1.status).toBe(HttpStatus.OK);

      const getRes1 = await request(tester.server)
        .get(`/resumes/${resume.id}`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(getRes1.status).toBe(HttpStatus.OK);
      expect(getRes1.body).toEqual(
        expect.objectContaining({
          experiences: expect.arrayContaining(experiences),
        }),
      );

      //some experiences
      const payload2 = { experiences: [experiences[0], experiences[1]] };
      const patchRes2 = await request(tester.server)
        .patch(`/resumes/${resume.id}`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send(payload2);
      expect(patchRes2.status).toBe(HttpStatus.OK);

      const getRes2 = await request(tester.server)
        .get(`/resumes/${resume.id}`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(getRes2.status).toBe(HttpStatus.OK);
      expect(getRes2.body).toEqual(
        expect.objectContaining({
          experiences: expect.arrayContaining(payload2.experiences),
        }),
      );

      //set no experience
      const payload3 = { experiences: [] };
      const patchRes3 = await request(tester.server)
        .patch(`/resumes/${resume.id}`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send(payload3);
      expect(patchRes3.status).toBe(HttpStatus.OK);

      const getRes3 = await request(tester.server)
        .get(`/resumes/${resume.id}`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(getRes3.status).toBe(HttpStatus.OK);
      expect(getRes3.body).toEqual(
        expect.objectContaining({
          experiences: expect.arrayContaining(payload3.experiences),
        }),
      );
    });
    it('should update a resume changing educations', async () => {
      const auth = await tester.signup();

      const { body: resume }: { body: ResumeDto } = await request(tester.server)
        .post('/resumes')
        .set('Authorization', `Bearer ${auth.token}`)
        .send();

      const educations = await Promise.all(
        Array.from({ length: 3 }).map(async () => {
          const { body: education }: { body: EducationDto } = await request(
            tester.server,
          )
            .post('/educations')
            .set('Authorization', `Bearer ${auth.token}`)
            .send();
          return education.id;
        }),
      );

      //set all educations
      const payload1 = { educations };
      const patchRes1 = await request(tester.server)
        .patch(`/resumes/${resume.id}`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send(payload1);
      expect(patchRes1.status).toBe(HttpStatus.OK);

      const getRes1 = await request(tester.server)
        .get(`/resumes/${resume.id}`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(getRes1.status).toBe(HttpStatus.OK);
      expect(getRes1.body).toEqual(
        expect.objectContaining({
          educations: expect.arrayContaining(educations),
        }),
      );

      //some educations
      const payload2 = { educations: [educations[0], educations[1]] };
      const patchRes2 = await request(tester.server)
        .patch(`/resumes/${resume.id}`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send(payload2);
      expect(patchRes2.status).toBe(HttpStatus.OK);

      const getRes2 = await request(tester.server)
        .get(`/resumes/${resume.id}`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(getRes2.status).toBe(HttpStatus.OK);
      expect(getRes2.body).toEqual(
        expect.objectContaining({
          educations: expect.arrayContaining(payload2.educations),
        }),
      );

      //set no education
      const payload3 = { educations: [] };
      const patchRes3 = await request(tester.server)
        .patch(`/resumes/${resume.id}`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send(payload3);
      expect(patchRes3.status).toBe(HttpStatus.OK);

      const getRes3 = await request(tester.server)
        .get(`/resumes/${resume.id}`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(getRes3.status).toBe(HttpStatus.OK);
      expect(getRes3.body).toEqual(
        expect.objectContaining({
          educations: expect.arrayContaining(payload3.educations),
        }),
      );
    });
  });
  describe('DELETE /resumes/:id', () => {
    it('should delete a resume without experiences and educations', async () => {
      const auth = await tester.signup();

      const addRes = await request(tester.server)
        .post('/resumes')
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(addRes.status).toBe(HttpStatus.CREATED);
      const resume = addRes.body;

      const deleteRes = await request(tester.server)
        .delete(`/resumes/${resume.id}`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(deleteRes.status).toBe(HttpStatus.OK);

      const listRes = await request(tester.server)
        .get(`/resumes`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(listRes.status).toBe(HttpStatus.OK);
      expect(listRes.body).toHaveLength(0);
    });
    it('should delete a resume with experiences and educations', async () => {
      const auth = await tester.signup();

      const { body: resume }: { body: ResumeDto } = await request(tester.server)
        .post('/resumes')
        .set('Authorization', `Bearer ${auth.token}`)
        .send();

      const experiences = await Promise.all(
        Array.from({ length: 3 }).map(async () => {
          const { body: experience }: { body: ExperienceDto } = await request(
            tester.server,
          )
            .post('/experiences')
            .set('Authorization', `Bearer ${auth.token}`)
            .send();
          return experience.id;
        }),
      );

      const educations = await Promise.all(
        Array.from({ length: 3 }).map(async () => {
          const { body: education }: { body: EducationDto } = await request(
            tester.server,
          )
            .post('/educations')
            .set('Authorization', `Bearer ${auth.token}`)
            .send();
          return education.id;
        }),
      );

      const patchRes = await request(tester.server)
        .patch(`/resumes/${resume.id}`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send({ experiences, educations });
      expect(patchRes.status).toBe(HttpStatus.OK);

      const deleteRes = await request(tester.server)
        .delete(`/resumes/${resume.id}`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(deleteRes.status).toBe(HttpStatus.OK);

      const listRes = await request(tester.server)
        .get(`/resumes`)
        .set('Authorization', `Bearer ${auth.token}`)
        .send();
      expect(listRes.status).toBe(HttpStatus.OK);
      expect(listRes.body).toHaveLength(0);
    });
  });

  describe('POST /resumes/example', () => {
    it('should create resume example', async () => {
      const auth = await tester.signup();

      const createResumeExampleUseCase = tester.testingModule.get(
        CreateResumeExampleUseCase,
      );
      const createResumeExampleUseCaseSpy = jest.spyOn(
        createResumeExampleUseCase,
        'execute',
      );

      const res = await request(tester.server)
        .post('/resumes/example')
        .set('Authorization', `Bearer ${auth.token}`)
        .send();

      expect(res.status).toBe(HttpStatus.CREATED);

      expect(createResumeExampleUseCaseSpy).toHaveBeenCalledWith({
        userId: auth.user.id,
      });
    });
  });
});
