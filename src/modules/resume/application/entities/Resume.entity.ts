import { Entity } from 'src/modules/common/application/value-objects/Entity';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { Name } from 'src/modules/common/application/value-objects/Name';

export class Resume implements Entity {
  private constructor(
    readonly id: Id,
    readonly userId: Id,
    public name: Name,
    public title: Name,
    public description: string,
    public experiences: Id[],
    public educations: Id[],
    readonly updatedAt: Date,
  ) {}

  update(input: {
    name?: Name;
    title?: Name;
    description?: string;
    experiences?: Id[];
    educations?: Id[];
  }) {
    if (input.name !== undefined) this.name = input.name;
    if (input.title !== undefined) this.title = input.title;
    if (input.description !== undefined) this.description = input.description;
    if (input.experiences !== undefined) this.experiences = input.experiences;
    if (input.educations !== undefined) this.educations = input.educations;
  }

  static create({
    userId,
    name,
    title,
    description,
    experiences,
    educations,
  }: {
    userId: Id;
    name: Name;
    title: Name;
    description?: string;
    experiences?: Id[];
    educations?: Id[];
  }) {
    return new Resume(
      new Id(),
      userId,
      name,
      title,
      description ?? '',
      experiences ?? [],
      educations ?? [],
      new Date(),
    );
  }

  static load({
    id,
    userId,
    name,
    title,
    description,
    experiences,
    educations,
    updatedAt,
  }: {
    id: Id;
    userId: Id;
    name: Name;
    title: Name;
    description: string;
    experiences: Id[];
    educations: Id[];
    updatedAt: Date;
  }) {
    return new Resume(
      id,
      userId,
      name,
      title,
      description,
      experiences,
      educations,
      updatedAt,
    );
  }
}
