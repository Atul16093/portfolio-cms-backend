import { Injectable } from '@nestjs/common';
import { DatabaseConnection } from '../../db/database.connection';
import { BaseQuery } from './base.query';

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactCreateInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Injectable()
export class ContactQuery extends BaseQuery {
  protected getTableName(): string {
    return 'contacts';
  }

  protected mapToEntity(row: any): Contact {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      subject: row.subject,
      message: row.message,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async create(input: ContactCreateInput): Promise<Contact> {
    const now = new Date();
    const insertData = {
      id: this.generateId(),
      name: input.name,
      email: input.email,
      subject: input.subject,
      message: input.message,
      created_at: now,
      updated_at: now,
    };

    const [row] = await this.knex(this.getTableName())
      .insert(insertData)
      .returning('*');

    return this.mapToEntity(row);
  }

  async findAll(options?: { limit?: number; offset?: number }): Promise<Contact[]> {
    let query = this.knex(this.getTableName()).orderBy('created_at', 'desc');

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.offset(options.offset);
    }

    const rows = await query;
    return this.mapToEntities(rows);
  }
}

