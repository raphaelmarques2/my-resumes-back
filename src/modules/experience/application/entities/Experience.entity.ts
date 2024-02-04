import { Id } from 'src/modules/common/application/value-objects/Id';
import { Name } from 'src/modules/common/application/value-objects/Name';

export class Experience {
  private constructor(
    readonly id: Id,
    readonly userId: Id,
    public title: Name,
    public company: Name,
    public description: string,
    public startDate: Date | null,
    public endDate: Date | null,
  ) {}

  update(input: {
    title?: Name;
    company?: Name;
    description?: string;
    startDate?: Date | null;
    endDate?: Date | null;
  }) {
    if (input.title !== undefined) this.title = input.title;
    if (input.company !== undefined) this.company = input.company;
    if (input.description !== undefined) this.description = input.description;
    if (input.startDate !== undefined) this.startDate = input.startDate;
    if (input.endDate !== undefined) this.endDate = input.endDate;
  }

  static create({
    userId,
    title,
    company,
    description,
    startDate,
    endDate,
  }: {
    userId: Id;
    title: Name;
    company: Name;
    description?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    return new Experience(
      new Id(),
      userId,
      title,
      company,
      description ?? '',
      startDate ?? null,
      endDate ?? null,
    );
  }

  static load({
    id,
    userId,
    title,
    company,
    description,
    startDate,
    endDate,
  }: {
    id: Id;
    userId: Id;
    title: Name;
    company: Name;
    description: string;
    startDate: Date | null;
    endDate: Date | null;
  }) {
    return new Experience(
      id,
      userId,
      title,
      company,
      description,
      startDate,
      endDate,
    );
  }
}
