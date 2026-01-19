import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Config
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';

// Database
import { DatabaseConnection } from './db/database.connection';
import { SchemaManager } from './db/schema.manager';

// Core
import { ResponseService, ResponseInterceptor } from './core/response-management';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { LoggerService } from './common/utils/logger.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

// Models
import { ProjectQuery } from './models/queries/project.query';
import { ProjectsQuery } from './models/queries/projects.query';
import { ProjectTechStackQuery } from './models/queries/project-tech-stack.query';
import { TechStackQuery } from './models/queries/tech-stack.query';
import { DashboardQuery } from './models/queries/dashboard.query';
import { ActivityLogQuery } from './models/queries/activity-log.query';
import { CaseStudyQuery } from './models/queries/case-study.query';
import { ContactQuery } from './models/queries/contact.query';
import { SiteConfigQuery } from './models/queries/site-config.query';
import { ExperienceQuery } from './models/queries/experience.query';

// Services
import { ProjectService } from './services/projects/project.service';
import { ProjectsService } from './services/cms-projects/projects.service';
import { CmsProjectsService } from './services/cms-projects/cms-projects.service';
import { DashboardService } from './services/dashboard/dashboard.service';
import { ActivityLogService } from './services/activity-log/activity-log.service';
import { CaseStudyService } from './services/case-studies/case-study.service';
import { ContactService } from './services/contact/contact.service';
import { SiteConfigService } from './services/site-config/site-config.service';
import { CmsExperienceService } from './services/cms-experience/cms-experience.service';

// Controllers
import { ProjectsController } from './controller/projects/projects.controller';
import { CmsProjectsController } from './controller/cms-projects/cms-projects.controller';
import { CmsTechStackController } from './controller/cms-tech-stack/cms-tech-stack.controller';
import { DashboardController } from './controller/dashboard/dashboard.controller';
import { CaseStudiesController } from './controller/case-studies/case-studies.controller';
import { ContactController } from './controller/contact/contact.controller';
import { SiteConfigController } from './controller/site-config/site-config.controller';
import { CmsExperienceController } from './controller/cms-experience/cms-experience.controller';

// Auth
import { AuthController } from './controller/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { AdminSessionQuery } from './models/queries/admin-session.query';
import { AdminUserQuery } from './models/queries/admin-user.query';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig],
      envFilePath: ['.env.local', '.env'],
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    ProjectsController,
    CmsProjectsController,
    CmsTechStackController,
    DashboardController,
    CaseStudiesController,
    ContactController,
    SiteConfigController,
    CmsExperienceController,
  ],
  providers: [
    AppService,
    AuthService,
    AdminUserQuery,
    AdminSessionQuery,  
    JwtService,
    ConfigService,  
    // Core
    ResponseService,
    LoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // Database
    DatabaseConnection,
    SchemaManager,
    // Models
    ProjectQuery,
    ProjectsQuery,
    ProjectTechStackQuery,
    TechStackQuery,
    DashboardQuery,
    ActivityLogQuery,
    CaseStudyQuery,
    ContactQuery,
    SiteConfigQuery,
    ExperienceQuery,
    // Services
    ProjectService,
    ProjectsService,
    CmsProjectsService,
    DashboardService,
    ActivityLogService,
    CaseStudyService,
    ContactService,
    SiteConfigService,
    CmsExperienceService,
  ],
})
export class AppModule {}

