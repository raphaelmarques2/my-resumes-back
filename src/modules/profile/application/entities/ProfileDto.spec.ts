import { faker } from '@faker-js/faker';
import { ProfileDto } from './ProfileDto';
import { Profile } from './Profile.entity';
import { Id } from 'src/modules/common/application/value-objects/Id';

describe('ProfileDto', () => {
  describe('createFrom', () => {
    it('should create dto from entity with all fields', async () => {
      const profile = Profile.load({
        id: new Id(),
        userId: new Id(),
        email: faker.internet.email(),
        name: faker.internet.displayName(),
        address: faker.lorem.text(),
        linkedin: faker.internet.url(),
      });
      const dto = ProfileDto.createFrom(profile);
      expect(dto).toEqual({
        id: profile.id.value,
        userId: profile.userId.value,
        email: profile.email,
        name: profile.name,
        address: profile.address,
        linkedin: profile.linkedin,
      });
    });
    it('should create dto without optional fields', async () => {
      const profile = Profile.load({
        id: new Id(),
        userId: new Id(),
        email: faker.internet.email(),
        name: faker.internet.displayName(),
        address: null,
        linkedin: null,
      });
      const dto = ProfileDto.createFrom(profile);
      expect(dto).toEqual({
        id: profile.id.value,
        userId: profile.userId.value,
        email: profile.email,
        name: profile.name,
      });
    });
  });
});
