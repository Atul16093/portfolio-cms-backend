import { Injectable } from '@nestjs/common';
import { DatabaseConnection } from '../db/database.connection';
import { Knex } from 'knex';

@Injectable()
export abstract class BaseQuery {
  constructor(protected dbConnection: DatabaseConnection) {}

  protected get knex(): Knex {
    return this.dbConnection.getKnex();
  }

  protected getTableName(): string {
    throw new Error('getTableName() must be implemented by subclass');
  }

  protected mapToEntity(row: any): any {
    return row;
  }

  protected mapToEntities(rows: any[]): any[] {
    return rows.map((row) => this.mapToEntity(row));
  }

  async findById(id: string): Promise<any | null> {
    const row = await this.knex(this.getTableName()).where({ id }).first();
    return row ? this.mapToEntity(row) : null;
  }

  async findAll(options?: { limit?: number; offset?: number; orderBy?: string; orderDirection?: 'asc' | 'desc' }): Promise<any[]> {
    let query = this.knex(this.getTableName());

    if (options?.orderBy) {
      query = query.orderBy(options.orderBy, options.orderDirection || 'asc');
    } else {
      query = query.orderBy('createdAt', 'desc');
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.offset(options.offset);
    }

    const rows = await query;
    return this.mapToEntities(rows);
  }

  async count(where?: Record<string, any>): Promise<number> {
    let query = this.knex(this.getTableName()).count('* as count').first();
    
    if (where) {
      query = query.where(where);
    }

    const result = await query;
    return parseInt(result?.count as string || '0', 10);
  }

  async create(data: Record<string, any>): Promise<any> {
    const now = new Date();
    const insertData = {
      ...data,
      id: data.id || this.generateId(),
      createdAt: now,
      updatedAt: now,
    };

    const [row] = await this.knex(this.getTableName())
      .insert(insertData)
      .returning('*');

    return this.mapToEntity(row);
  }

  async update(id: string, data: Record<string, any>): Promise<any> {
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    const [row] = await this.knex(this.getTableName())
      .where({ id })
      .update(updateData)
      .returning('*');

    return row ? this.mapToEntity(row) : null;
  }

  async delete(id: string): Promise<void> {
    await this.knex(this.getTableName()).where({ id }).delete();
  }

  protected generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

