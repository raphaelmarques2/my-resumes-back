import { Entity } from 'src/modules/common/application/value-objects/Entity';
import { Id } from 'src/modules/common/application/value-objects/Id';
import { Name } from 'src/modules/common/application/value-objects/Name';

export class Education implements Entity {
  private constructor(
    readonly id: Id,
    readonly userId: Id,
    public title: Name,
    public institution: Name,
    public startDate: Date | null,
    public endDate: Date | null,
  ) {}

  update(input: {
    title?: Name;
    institution?: Name;
    startDate?: Date | null;
    endDate?: Date | null;
  }) {
    if (input.title !== undefined) this.title = input.title;
    if (input.institution !== undefined) this.institution = input.institution;
    if (input.startDate !== undefined) this.startDate = input.startDate;
    if (input.endDate !== undefined) this.endDate = input.endDate;
  }

  static create({
    userId,
    title,
    institution,
    startDate,
    endDate,
  }: {
    userId: Id;
    title: Name;
    institution: Name;
    startDate: Date | null;
    endDate: Date | null;
  }) {
    return new Education(
      new Id(),
      userId,
      title,
      institution,
      startDate,
      endDate,
    );
  }

  static load({
    id,
    userId,
    title,
    institution,
    startDate,
    endDate,
  }: {
    id: Id;
    userId: Id;
    title: Name;
    institution: Name;
    startDate: Date | null;
    endDate: Date | null;
  }) {
    return new Education(id, userId, title, institution, startDate, endDate);
  }
}
