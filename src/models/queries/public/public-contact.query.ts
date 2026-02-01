import { Injectable } from '@nestjs/common';
import { BaseQuery } from '../base.query';

@Injectable()
export class PublicContactQuery extends BaseQuery {
  protected getTableName(): string {
    return 'data.contacts';
  }

  async create(input: { name: string; email: string; message: string }): Promise<void> {
    const insertData = {
      name: input.name,
      email: input.email,
      message: input.message,
      status: 'new',
      // id, uuid, created_at default
    };

    await this.knex(this.getTableName()).insert(insertData);
  }

  async countRecentByEmail(email: string, minutes: number): Promise<number> {
    const timeAgo = new Date(Date.now() - minutes * 60 * 1000);
    
    const result = await this.knex(this.getTableName())
      .where('email', email)
      .andWhere('created_at', '>=', timeAgo)
      .count('id as count')
      .first();

    return result ? parseInt(result.count as string, 10) : 0;
  }
}
