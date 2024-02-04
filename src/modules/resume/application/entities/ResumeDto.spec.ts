import { faker } from '@faker-js/faker';
import { ResumeDto } from './ResumeDto';
import { Resume } from './Resume.entity';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { Name } from 'src/modules/common/application/value-objects/Name';

describe('ResumeDto', () => {
  describe('createFrom', () => {
    it('should create dto from entity with all fields', async () => {
      const today = new Date();
      const resume = Resume.load({
        id: new Id(),
        userId: new Id(),
        name: new Name(faker.internet.userName()),
        title: new Name(faker.internet.displayName()),
        description: faker.lorem.paragraph(),
        experiences: [new Id(), new Id(), new Id()],
        educations: [new Id(), new Id(), new Id()],
        updatedAt: today,
      });
      const dto = ResumeDto.createFrom(resume);
      expect(dto).toEqual({
        id: resume.id.value,
        userId: resume.userId.value,
        name: resume.name.value,
        title: resume.title.value,
        description: resume.description,
        experiences: resume.experiences.map((e) => e.value),
        educations: resume.educations.map((e) => e.value),
        updatedAt: today.toISOString(),
      });
    });
    it('should create dto from entity with empty experiences', async () => {
      const today = new Date();
      const resume = Resume.load({
        id: new Id(),
        userId: new Id(),
        name: new Name(faker.internet.userName()),
        title: new Name(faker.internet.displayName()),
        description: faker.lorem.paragraph(),
        experiences: [],
        educations: [],
        updatedAt: today,
      });
      const dto = ResumeDto.createFrom(resume);
      expect(dto).toEqual({
        id: resume.id.value,
        userId: resume.userId.value,
        name: resume.name.value,
        title: resume.title.value,
        description: resume.description,
        experiences: [],
        educations: [],
        updatedAt: today.toISOString(),
      });
    });
  });
});
