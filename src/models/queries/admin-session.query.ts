import { Injectable } from '@nestjs/common';
import { DatabaseConnection } from '../../db/database.connection';
import { BaseQuery } from './base.query';
import { Knex } from 'knex';

export interface AdminSession {
  id: number;
  uuid: string;
  adminUserId: number;
  sessionId: string;
  accessTokenHash: string;
  refreshTokenHash: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  deviceInfo: any | null;
  isRevoked: boolean;
  revokedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  lastUsedAt: Date | null;
}

export interface AdminSessionCreateInput {
  adminUserId: number;
  sessionId: string;
  accessTokenHash: string;
  refreshTokenHash: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  deviceInfo?: any;
}

@Injectable()
export class AdminSessionQuery extends BaseQuery {
  protected getTableName(): string {
    return 'data.admin_login_activity';
  }

  protected mapToEntity(row: any): AdminSession {
    return {
      id: row.id,
      uuid: row.uuid,
      adminUserId: row.admin_user_id,
      sessionId: row.session_id,
      accessTokenHash: row.access_token_hash,
      refreshTokenHash: row.refresh_token_hash,
      accessTokenExpiresAt: row.access_token_expires_at,
      refreshTokenExpiresAt: row.refresh_token_expires_at,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
      deviceInfo: row.device_info,
      isRevoked: row.is_revoked,
      revokedAt: row.revoked_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      lastUsedAt: row.last_used_at,
    };
  }

  async create(input: AdminSessionCreateInput): Promise<AdminSession> {
    const now = new Date();
    const insertData = {
      admin_user_id: input.adminUserId,
      session_id: input.sessionId,
      access_token_hash: input.accessTokenHash,
      refresh_token_hash: input.refreshTokenHash,
      access_token_expires_at: input.accessTokenExpiresAt,
      refresh_token_expires_at: input.refreshTokenExpiresAt,
      ip_address: input.ipAddress || null,
      user_agent: input.userAgent || null,
      device_info: input.deviceInfo || null,
      is_revoked: false,
      revoked_at: null,
      created_at: now,
      updated_at: now,
      last_used_at: now,
    };

    const [row] = await this.knex(this.getTableName())
      .insert(insertData)
      .returning('*');

    return this.mapToEntity(row);
  }

  async findByRefreshTokenHash(refreshTokenHash: string): Promise<AdminSession | null> {
    const row = await this.knex(this.getTableName())
      .where({ refresh_token_hash: refreshTokenHash })
      .where('is_revoked', false)
      .where('refresh_token_expires_at', '>', this.knex.fn.now())
      .first();
    return row ? this.mapToEntity(row) : null;
  }

  async findBySessionId(sessionId: string): Promise<AdminSession | null> {
    const row = await this.knex(this.getTableName())
      .where({ session_id: sessionId })
      .first();
    return row ? this.mapToEntity(row) : null;
  }

  async revokeSession(sessionId: string): Promise<void> {
    await this.knex(this.getTableName())
      .where({ session_id: sessionId })
      .update({
        is_revoked: true,
        revoked_at: this.knex.fn.now(),
        updated_at: this.knex.fn.now(),
      });
  }

  async updateRefreshToken(sessionId: string, newRefreshTokenHash: string, newRefreshTokenExpiresAt: Date): Promise<void> {
    await this.knex(this.getTableName())
      .where({ session_id: sessionId })
      .update({
        refresh_token_hash: newRefreshTokenHash,
        refresh_token_expires_at: newRefreshTokenExpiresAt,
        last_used_at: this.knex.fn.now(),
        updated_at: this.knex.fn.now(),
      });
  }

  async updateLastUsedAt(sessionId: string): Promise<void> {
    await this.knex(this.getTableName())
      .where({ session_id: sessionId })
      .update({
        last_used_at: this.knex.fn.now(),
        updated_at: this.knex.fn.now(),
      });
  }

  async findByAccessTokenHash(accessTokenHash: string): Promise<AdminSession | null> {
    const row = await this.knex(this.getTableName())
      .where({ access_token_hash: accessTokenHash })
      .where('is_revoked', false)
      .where('access_token_expires_at', '>', this.knex.fn.now())
      .first();
    return row ? this.mapToEntity(row) : null;
  }
}

