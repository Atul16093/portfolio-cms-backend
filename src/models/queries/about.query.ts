import { Injectable } from '@nestjs/common';
import { BaseQuery } from './base.query';
import { About, CreateAboutInput, UpdateAboutInput } from '../../domain/about/about.types';
import { IAboutRepository } from '../../domain/about/about.contract';

@Injectable()
export class AboutQuery extends BaseQuery implements IAboutRepository {
  protected getTableName(): string {
    return 'data.about';
  }

  protected mapToEntity(row: any): About {
    if (!row) return null;
    return {
      id: row.id,
      uuid: row.uuid,
      name: row.name,
      title: row.title,
      shortIntro: row.short_intro,
      description: row.description,
      yearsOfExperience: row.years_of_experience,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async createAbout(input: CreateAboutInput): Promise<About> {
    const [row] = await this.knex(this.getTableName())
      .insert({
        name: input.name,
        title: input.title,
        short_intro: input.shortIntro,
        description: input.description ? JSON.stringify(input.description) : null,
        years_of_experience: input.yearsOfExperience,
        is_active: input.isActive,
      })
      .returning('*');
    return this.mapToEntity(row);
  }

  async getAbout(uuid: string): Promise<About | null> {
    const row = await this.knex(this.getTableName()).where({ uuid }).first();
    return row ? this.mapToEntity(row) : null;
  }

  async getActiveAbout(): Promise<About | null> {
    const row = await this.knex(this.getTableName())
      .where({ is_active: true })
      .orderBy('created_at', 'desc') // In case of race condition/duplicate, take latest
      .first();
    return row ? this.mapToEntity(row) : null;
  }

  async updateAbout(uuid: string, input: UpdateAboutInput): Promise<About> {
    const dbData: any = {};
    if (input.name !== undefined) dbData.name = input.name;
    if (input.title !== undefined) dbData.title = input.title;
    if (input.shortIntro !== undefined) dbData.short_intro = input.shortIntro;
    if (input.description !== undefined)
      dbData.description = input.description ? JSON.stringify(input.description) : null;
    if (input.yearsOfExperience !== undefined)
      dbData.years_of_experience = input.yearsOfExperience;
    if (input.isActive !== undefined) dbData.is_active = input.isActive;
    dbData.updated_at = new Date();

    const [row] = await this.knex(this.getTableName())
      .where({ uuid })
      .update(dbData)
      .returning('*');
    return this.mapToEntity(row);
  }

  async deactivateAllExcept(uuid?: string): Promise<void> {
    const query = this.knex(this.getTableName())
      .update({ is_active: false })
      .where('is_active', true);

    if (uuid) {
      query.whereNot({ uuid });
    }

    await query;
  }

  async getAll(): Promise<About[]> {
    const rows = await this.knex(this.getTableName()).orderBy('created_at', 'desc');
    return rows.map((r) => this.mapToEntity(r));
  }
}
