import { faker } from '@faker-js/faker';
import { Credential } from 'src/modules/auth/application/entities/Credential.entity';
import { ResetPasswordRequest } from 'src/modules/auth/application/entities/ResetPassordRequest.entity';
import { User } from 'src/modules/auth/application/entities/User.entity';
import { Email } from 'src/modules/common/application/value-objects/Email';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { Name } from 'src/modules/common/application/value-objects/Name';
import { Education } from 'src/modules/education/application/entities/Education.entity';
import { Experience } from 'src/modules/experience/application/entities/Experience.entity';
import { Profile } from 'src/modules/profile/application/entities/Profile.entity';
import { Resume } from 'src/modules/resume/application/entities/Resume.entity';

export function createUser() {
  const user = User.load({
    id: new Id(faker.string.uuid()),
    name: new Name(faker.person.fullName()),
    email: new Email(faker.internet.email()),
  });
  return user;
}

export function createProfile(user: User) {
  return Profile.load({
    id: new Id(faker.string.uuid()),
    userId: user.id,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    address: faker.lorem.sentence(),
    linkedin: faker.internet.url(),
  });
}

export function createEducation(user: User) {
  return Education.load({
    id: new Id(faker.string.uuid()),
    userId: user.id,
    title: new Name(faker.lorem.sentence()),
    institution: new Name(faker.lorem.sentence()),
    startDate: faker.date.past(),
    endDate: faker.date.past(),
  });
}

export function createExperience(user: User) {
  return Experience.load({
    id: new Id(faker.string.uuid()),
    userId: user.id,
    title: new Name(faker.lorem.sentence()),
    company: new Name(faker.lorem.sentence()),
    description: faker.lorem.paragraph(),
    startDate: faker.date.past(),
    endDate: faker.date.past(),
  });
}

export function createCredential(user: User) {
  return Credential.load({
    id: new Id(faker.string.uuid()),
    userId: user.id,
    password: faker.internet.password(),
  });
}

export function createRequest(user: User) {
  return ResetPasswordRequest.load({
    id: new Id(faker.string.uuid()),
    userId: user.id,
    expiresAt: faker.date.future(),
    token: new Id(faker.string.uuid()),
    active: true,
  });
}

export function createResume(user: User) {
  return Resume.load({
    id: new Id(faker.string.uuid()),
    userId: user.id,
    name: new Name(faker.lorem.sentence()),
    title: new Name(faker.lorem.sentence()),
    description: faker.lorem.paragraph(),
    experiences: [],
    educations: [],
    updatedAt: faker.date.past(),
  });
}
