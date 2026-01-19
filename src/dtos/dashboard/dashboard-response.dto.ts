import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Project metrics for dashboard summary
 */
export class ProjectMetricsDto {
  @ApiProperty({ description: 'Total number of projects', example: 25 })
  total!: number;

  @ApiProperty({ description: 'Number of published (active) projects', example: 20 })
  published!: number;

  @ApiProperty({ description: 'Number of draft (inactive) projects', example: 5 })
  draft!: number;
}

/**
 * Contact metrics for dashboard summary
 */
export class ContactMetricsDto {
  @ApiProperty({ description: 'Total number of contact messages', example: 150 })
  total!: number;

  @ApiProperty({ description: 'Number of unread contact messages', example: 12 })
  unread!: number;
}

/**
 * Session metrics for dashboard summary
 */
export class SessionMetricsDto {
  @ApiProperty({ description: 'Number of active admin sessions', example: 3 })
  active!: number;
}

/**
 * Dashboard summary response DTO
 * Lightweight system overview for dashboard cards
 */
export class DashboardSummaryResponseDto {
  @ApiProperty({ description: 'Project metrics', type: ProjectMetricsDto })
  projects!: ProjectMetricsDto;

  @ApiProperty({ description: 'Contact metrics', type: ContactMetricsDto })
  contacts!: ContactMetricsDto;

  @ApiProperty({ description: 'Session metrics', type: SessionMetricsDto })
  sessions!: SessionMetricsDto;

  @ApiProperty({
    description: 'Timestamp when the summary was generated',
    example: '2024-01-19T12:00:00.000Z',
  })
  generatedAt!: string;
}

/**
 * Entity reference for activity items
 * Optional reference to the entity that triggered the activity
 */
export class ActivityEntityDto {
  @ApiProperty({ description: 'Entity ID', example: 1 })
  id!: number | string;

  @ApiProperty({ description: 'Entity label/name', example: 'My Awesome Project' })
  label!: string;
}

/**
 * Activity item in dashboard activity feed
 */
export class ActivityItemDto {
  @ApiProperty({
    description: 'Activity type',
    enum: [
      'PROJECT_CREATED',
      'PROJECT_UPDATED',
      'PROJECT_PUBLISHED',
      'PROJECT_UNPUBLISHED',
      'CONTACT_RECEIVED',
      'ADMIN_LOGIN',
      'ADMIN_LOGOUT',
      'SESSION_REVOKED',
    ],
    example: 'PROJECT_CREATED',
  })
  type!: string;

  @ApiProperty({
    description: 'Human-readable activity message',
    example: 'New project "My Awesome Project" was created',
  })
  message!: string;

  @ApiProperty({
    description: 'Timestamp when the activity occurred',
    example: '2024-01-19T12:00:00.000Z',
  })
  createdAt!: string;

  @ApiPropertyOptional({
    description: 'Optional reference to the entity that triggered this activity',
    type: ActivityEntityDto,
  })
  entity?: ActivityEntityDto;
}

/**
 * Dashboard activity response DTO
 * Recent system activities for dashboard feed
 */
export class DashboardActivityResponseDto {
  @ApiProperty({
    description: 'Array of recent activities',
    type: [ActivityItemDto],
  })
  activities!: ActivityItemDto[];
}
