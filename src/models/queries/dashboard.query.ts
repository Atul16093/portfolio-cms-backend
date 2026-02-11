import { Injectable } from '@nestjs/common';
import { DatabaseConnection } from '../../db/database.connection';
import { BaseQuery } from './base.query';

/**
 * Project metrics from database
 */
export interface ProjectMetrics {
  total: number;
  published: number;
  draft: number;
}

/**
 * Contact metrics from database
 */
export interface ContactMetrics {
  total: number;
  unread: number;
}

/**
 * Session metrics from database
 */
export interface SessionMetrics {
  active: number;
}

/**
 * Tech Stack metrics from database
 */
export interface TechStackMetrics {
  total: number;
}

/**
 * Experience metrics from database
 */
export interface ExperienceMetrics {
  total: number;
}

/**
 * Raw activity row from database queries
 */
export interface ActivityRow {
  type: string;
  message: string;
  created_at: Date;
  entity_id?: number | string;
  entity_label?: string;
}

/**
 * Query layer for dashboard operations
 * Handles ALL database operations using Knex - NO business logic
 * Uses COUNT(*) for summary metrics and simple queries for activities
 */
@Injectable()
export class DashboardQuery extends BaseQuery {
  constructor(protected dbConnection: DatabaseConnection) {
    super(dbConnection);
  }

  /**
   * Get project metrics (total, published, draft)
   * Uses COUNT(*) with WHERE clauses for efficiency
   */
  async getProjectMetrics(): Promise<ProjectMetrics> {
    // Get total count
    const totalResult = await this.knex('data.projects')
      .count('id as count')
      .first();

    // Get published count (status = 'active')
    const publishedResult = await this.knex('data.projects')
      .where('status', 'active')
      .count('id as count')
      .first();

    // Get draft count (status = 'inactive')
    const draftResult = await this.knex('data.projects')
      .where('status', 'inactive')
      .count('id as count')
      .first();

    return {
      total: parseInt(totalResult?.count as string || '0', 10),
      published: parseInt(publishedResult?.count as string || '0', 10),
      draft: parseInt(draftResult?.count as string || '0', 10),
    };
  }

  /**
   * Get contact metrics (total, unread)
   * Unread contacts have status = 'new'
   */
  async getContactMetrics(): Promise<ContactMetrics> {
    // Get total count
    const totalResult = await this.knex('data.contacts')
      .count('id as count')
      .first();

    // Get unread count (status = 'new')
    const unreadResult = await this.knex('data.contacts')
      .where('status', 'new')
      .count('id as count')
      .first();

    return {
      total: parseInt(totalResult?.count as string || '0', 10),
      unread: parseInt(unreadResult?.count as string || '0', 10),
    };
  }

  /**
   * Get active session count
   * Active sessions are not revoked and refresh token not expired
   */
  async getSessionMetrics(): Promise<SessionMetrics> {
    const activeResult = await this.knex('data.admin_login_activity')
      .where('is_revoked', false)
      .where('refresh_token_expires_at', '>', this.knex.fn.now())
      .count('id as count')
      .first();

    return {
      active: parseInt(activeResult?.count as string || '0', 10),
    };
  }

  /**
   * Get tech stack metrics (total count)
   */
  async getTechStackMetrics(): Promise<TechStackMetrics> {
    const totalResult = await this.knex('data.tech_stack')
      .count('id as count')
      .first();

    return {
      total: parseInt(totalResult?.count as string || '0', 10),
    };
  }

  /**
   * Get experience metrics (total count)
   */
  async getExperienceMetrics(): Promise<ExperienceMetrics> {
    const totalResult = await this.knex('data.experience')
      .count('id as count')
      .first();

    return {
      total: parseInt(totalResult?.count as string || '0', 10),
    };
  }

  /**
   * Get recent project activities
   * Returns both created and updated projects as activity rows
   * Limited to most recent entries for performance
   */
  async getRecentProjectActivities(limit: number): Promise<ActivityRow[]> {
    // Get recent created projects
    const createdProjects = await this.knex('data.projects')
      .select('id', 'title', 'status', 'created_at')
      .orderBy('created_at', 'desc')
      .limit(limit);

    // Get recent updated projects (excluding those just created)
    const updatedProjects = await this.knex('data.projects')
      .select('id', 'title', 'status', 'updated_at as created_at')
      .whereRaw('updated_at > created_at')
      .orderBy('updated_at', 'desc')
      .limit(limit);

    const activities: ActivityRow[] = [];

    // Map created projects to PROJECT_CREATED or PROJECT_PUBLISHED
    for (const project of createdProjects) {
      activities.push({
        type: project.status === 'active' ? 'PROJECT_PUBLISHED' : 'PROJECT_CREATED',
        message: `Project "${project.title}" was ${project.status === 'active' ? 'published' : 'created'}`,
        created_at: project.created_at,
        entity_id: project.id,
        entity_label: project.title,
      });
    }

    // Map updated projects to PROJECT_UPDATED or status change activities
    for (const project of updatedProjects) {
      activities.push({
        type: 'PROJECT_UPDATED',
        message: `Project "${project.title}" was updated`,
        created_at: project.created_at,
        entity_id: project.id,
        entity_label: project.title,
      });
    }

    return activities;
  }

  /**
   * Get recent contact activities
   * Maps new contacts to CONTACT_RECEIVED activity
   * Uses contacts table structure: id, name, email, message, status, created_at
   */
  async getRecentContactActivities(limit: number): Promise<ActivityRow[]> {
    const contacts = await this.knex('data.contacts')
      .select('id', 'name', 'email', 'created_at')
      .orderBy('created_at', 'desc')
      .limit(limit);

    return contacts.map((contact) => ({
      type: 'CONTACT_RECEIVED',
      message: `New contact message from ${contact.name} (${contact.email})`,
      created_at: contact.created_at,
      entity_id: contact.id,
      entity_label: `${contact.name} - ${contact.email}`,
    }));
  }

  /**
   * Get recent admin session activities
   * Maps sessions to ADMIN_LOGIN, ADMIN_LOGOUT, and SESSION_REVOKED
   */
  async getRecentSessionActivities(limit: number): Promise<ActivityRow[]> {
    // Get recent logins (new sessions)
    const logins = await this.knex('data.admin_login_activity')
      .select('id', 'admin_user_id', 'created_at')
      .orderBy('created_at', 'desc')
      .limit(limit);

    // Get recent revocations
    const revocations = await this.knex('data.admin_login_activity')
      .select('id', 'admin_user_id', 'revoked_at as created_at')
      .whereNotNull('revoked_at')
      .orderBy('revoked_at', 'desc')
      .limit(limit);

    const activities: ActivityRow[] = [];

    // Map logins to ADMIN_LOGIN
    for (const login of logins) {
      activities.push({
        type: 'ADMIN_LOGIN',
        message: 'Admin user logged in',
        created_at: login.created_at,
        entity_id: login.admin_user_id,
        entity_label: `Admin User #${login.admin_user_id}`,
      });
    }

    // Map revocations to SESSION_REVOKED
    for (const revocation of revocations) {
      activities.push({
        type: 'SESSION_REVOKED',
        message: 'Admin session was revoked',
        created_at: revocation.created_at,
        entity_id: revocation.admin_user_id,
        entity_label: `Admin User #${revocation.admin_user_id}`,
      });
    }

    return activities;
  }

  /**
   * Get all recent activities from activity_logs table
   * If activity_logs table exists, use it; otherwise fall back to deriving from existing tables
   */
  async getRecentActivities(limit: number): Promise<ActivityRow[]> {
    // Check if activity_logs table exists by attempting to query it
    try {
      const activityLogs = await this.knex('data.activity_logs')
        .select(
          'activity_type as type',
          'message',
          'entity_id',
          'entity_label',
          'created_at',
        )
        .orderBy('created_at', 'desc')
        .limit(limit);

      // Map activity_logs rows to ActivityRow format
      return activityLogs.map((log) => ({
        type: log.type,
        message: log.message,
        created_at: log.created_at,
        entity_id: log.entity_id,
        entity_label: log.entity_label,
      }));
    } catch (error) {
      // If activity_logs table doesn't exist, fall back to deriving from existing tables
      // This maintains backward compatibility during migration
      const fetchLimit = Math.min(limit * 2, 50);

      const [projectActivities, contactActivities, sessionActivities] = await Promise.all([
        this.getRecentProjectActivities(fetchLimit),
        this.getRecentContactActivities(fetchLimit),
        this.getRecentSessionActivities(fetchLimit),
      ]);

      const allActivities = [
        ...projectActivities,
        ...contactActivities,
        ...sessionActivities,
      ];

      allActivities.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });

      return allActivities.slice(0, limit);
    }
  }
}
