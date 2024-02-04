import { faker } from '@faker-js/faker';
import { UserDto } from './User.dto';
import { User } from './User.entity';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { Name } from 'src/modules/common/application/value-objects/Name';
import { Email } from 'src/modules/common/application/value-objects/Email';

describe('UserDto', () => {
  describe('createFrom', () => {
    it('should create dto from entity with all fields', async () => {
      const user = User.create({
        id: new Id(),
        name: new Name(faker.internet.userName()),
        email: new Email(faker.internet.email()),
      });
      const dto = UserDto.createFrom(user);
      expect(dto).toEqual({
        id: user.id.value,
        name: user.name.value,
        email: user.email.value,
      });
    });
  });
});
