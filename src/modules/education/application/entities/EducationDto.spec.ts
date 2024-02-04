import { EducationDto } from './EducationDto';
import { faker } from '@faker-js/faker';
import { Education } from './Education.entity';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { Name } from 'src/modules/common/application/value-objects/Name';

describe('EducationDto', () => {
  describe('createFrom', () => {
    it('should create dto from entity with all fields', async () => {
      const education = Education.load({
        id: new Id(),
        userId: new Id(),
        title: new Name(faker.internet.displayName()),
        institution: new Name(faker.internet.displayName()),
        startDate: new Date('2023/01/02'),
        endDate: new Date('2023/01/03'),
      });
      const dto = EducationDto.createFrom(education);
      expect(dto).toEqual({
        id: education.id.value,
        userId: education.userId.value,
        title: education.title.value,
        institution: education.institution.value,
        startDate: new Date('2023/01/02').toISOString(),
        endDate: new Date('2023/01/03').toISOString(),
      });
    });
    it('should create dto from entity with empty startDate and endDate', async () => {
      const education = Education.load({
        id: new Id(),
        userId: new Id(),
        title: new Name(faker.internet.displayName()),
        institution: new Name(faker.internet.displayName()),
        startDate: null,
        endDate: null,
      });
      const dto = EducationDto.createFrom(education);
      expect(dto).toEqual({
        id: education.id.value,
        userId: education.userId.value,
        title: education.title.value,
        institution: education.institution.value,
      });
    });
  });
});
