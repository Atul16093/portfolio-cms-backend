import { Injectable } from '@nestjs/common';
import { BaseQuery } from '../base.query';

export interface PublicTechStackItem {
  id: string; // UUID
  name: string;
  category: string;
  iconUrl: string | null;
  priority: number;
}

export interface PublicTechStackGrouped {
  [category: string]: PublicTechStackItem[];
}

@Injectable()
export class PublicTechStackQuery extends BaseQuery {
  protected getTableName(): string {
    return 'data.tech_stack';
  }

  async findVisibleGrouped(): Promise<PublicTechStackGrouped> {
    const rows = await this.knex(this.getTableName())
      .select('uuid', 'name', 'category', 'icon_url', 'priority')
      .where('is_visible', true)
      .orderBy('category', 'asc')
      .orderBy('priority', 'asc')
      .orderBy('name', 'asc');

    const grouped: PublicTechStackGrouped = {};
    for (const row of rows) {
      const item: PublicTechStackItem = {
        id: row.uuid,
        name: row.name,
        category: row.category,
        iconUrl: row.icon_url || null,
        priority: row.priority ?? 0,
      };
      
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    }
    return grouped;
  }
}
