import { Id } from 'src/modules/common/application/value-objects/Id';
import { Experience } from './Experience.entity';
import { ExperienceDto } from './ExperienceDto';
import { faker } from '@faker-js/faker';
import { Name } from 'src/modules/common/application/value-objects/Name';

describe('ExperienceDto', () => {
  describe('createFrom', () => {
    it('should create dto from entity with all fields', async () => {
      const experience = Experience.load({
        id: new Id(),
        userId: new Id(),
        title: new Name(faker.internet.displayName()),
        company: new Name(faker.internet.displayName()),
        description: faker.lorem.paragraph(),
        startDate: new Date('2023/01/02'),
        endDate: new Date('2023/01/03'),
      });

      const dto = ExperienceDto.createFrom(experience);
      expect(dto).toEqual({
        id: experience.id.value,
        userId: experience.userId.value,
        title: experience.title.value,
        company: experience.company.value,
        description: experience.description,
        startDate: new Date('2023/01/02').toISOString(),
        endDate: new Date('2023/01/03').toISOString(),
      });
    });
    it('should create dto from entity with empty startDate and endDate', async () => {
      const experience = Experience.load({
        id: new Id(),
        userId: new Id(),
        title: new Name(faker.internet.displayName()),
        company: new Name(faker.internet.displayName()),
        description: faker.lorem.paragraph(),
        startDate: null,
        endDate: null,
      });
      const dto = ExperienceDto.createFrom(experience);
      expect(dto).toEqual({
        id: experience.id.value,
        userId: experience.userId.value,
        title: experience.title.value,
        company: experience.company.value,
        description: experience.description,
      });
    });
  });
});
