import { Injectable } from '@nestjs/common';
import { DatabaseConnection } from '../../db/database.connection';
import { BaseQuery } from './base.query';
import { Knex } from 'knex';

export interface AdminUser {
  id: number;
  uuid: string;
  email: string;
  passwordHash: string;
  role: string;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class AdminUserQuery extends BaseQuery {
  protected getTableName(): string {
    return 'data.users';
  }

  protected mapToEntity(row: any): AdminUser {
    return {
      id: row.id,
      uuid: row.uuid,
      email: row.email,
      passwordHash: row.password_hash,
      role: row.role,
      isActive: row.is_active,
      lastLoginAt: row.last_login_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findByEmail(email: string): Promise<AdminUser | null> {
    const row = await this.knex(this.getTableName())
      .where({ email })
      .first();
    return row ? this.mapToEntity(row) : null;
  }

  async findByUserId(id: number): Promise<AdminUser | null> {
    const row = await this.knex(this.getTableName())
      .where({ id })
      .first();
    return row ? this.mapToEntity(row) : null;
  }

  async updateLastLoginAt(id: number): Promise<void> {
    await this.knex(this.getTableName())
      .where({ id })
      .update({ last_login_at: this.knex.fn.now() });
  }
}

