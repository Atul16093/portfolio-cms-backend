import { Injectable } from '@nestjs/common';
import { BaseQuery } from '../base.query';

@Injectable()
export class PublicExperienceQuery extends BaseQuery {
  protected getTableName(): string {
    return 'data.experience';
  }

  private toJsonbText(value: string): string {
      return JSON.stringify(value);
  }

  protected mapToEntity(row: any): any {
    const formatDate = (date: any): string | null => {
      if (!date) return null;
      if (typeof date === 'string') return date.split('T')[0];
      if (date instanceof Date) return date.toISOString().split('T')[0];
      return null;
    };

    return {
      id: row.uuid,
      company: row.company,
      role: row.role,
      start_date: formatDate(row.start_date),
      end_date: formatDate(row.end_date),
      description: row.description == null
          ? null
          : typeof row.description === 'string'
            ? row.description
            : JSON.stringify(row.description),
      order_index: row.order_index,
      is_visible: row.is_visible,
      created_at: row.created_at,
    };
  }

  async findAllVisible(): Promise<any[]> {
    const rows = await this.knex(this.getTableName())
      .where('is_visible', true)
      .orderBy('order_index', 'asc')
      .select('*');

    return this.mapToEntities(rows);
  }
}
