import { Injectable } from '@nestjs/common';
import { DashboardQuery } from '../../models/queries/dashboard.query';
import {
  DashboardSummaryResponseDto,
  DashboardActivityResponseDto,
  ActivityItemDto,
  ActivityEntityDto,
} from '../../dtos/dashboard/dashboard-response.dto';
import { DashboardActivityRequestDto } from '../../dtos/dashboard/dashboard-request.dto';
import { ActivityRow } from '../../models/queries/dashboard.query';

/**
 * Service layer for dashboard operations
 * Contains business logic and orchestration - NO database queries directly
 * Uses query layer for all database operations
 * Maps raw query data to response DTOs
 */
@Injectable()
export class DashboardService {
  constructor(private dashboardQuery: DashboardQuery) {}

  /**
   * Get dashboard summary
   * Business logic: Orchestrates multiple metric queries and combines results
   * Applies timestamp for cache invalidation tracking
   */
  async getSummary(): Promise<DashboardSummaryResponseDto> {
    // Fetch all metrics in parallel for performance
    const [projectMetrics, contactMetrics, sessionMetrics] = await Promise.all([
      this.dashboardQuery.getProjectMetrics(),
      this.dashboardQuery.getContactMetrics(),
      this.dashboardQuery.getSessionMetrics(),
    ]);

    // Map raw query data to response DTO shape
    return {
      projects: {
        total: projectMetrics.total,
        published: projectMetrics.published,
        draft: projectMetrics.draft,
      },
      contacts: {
        total: contactMetrics.total,
        unread: contactMetrics.unread,
      },
      sessions: {
        active: sessionMetrics.active,
      },
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Get dashboard activity feed
   * Business logic: Applies default limit, orchestrates activity query, maps to DTOs
   */
  async getActivity(request: DashboardActivityRequestDto): Promise<DashboardActivityResponseDto> {
    // Apply default limit if not provided (enforced by Zod, but double-check for safety)
    const limit = request.limit || 5;

    // Fetch recent activities from query layer
    const activityRows = await this.dashboardQuery.getRecentActivities(limit);

    // Map raw activity rows to response DTOs
    const activities: ActivityItemDto[] = activityRows.map((row: ActivityRow) => {
      const activity: ActivityItemDto = {
        type: row.type,
        message: row.message,
        createdAt: new Date(row.created_at).toISOString(),
      };

      // Add entity reference if available
      if (row.entity_id && row.entity_label) {
        activity.entity = {
          id: row.entity_id,
          label: row.entity_label,
        };
      }

      return activity;
    });

    return {
      activities,
    };
  }
}
