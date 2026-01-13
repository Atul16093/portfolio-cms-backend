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
import { CaseStudyQuery } from './models/queries/case-study.query';
import { ContactQuery } from './models/queries/contact.query';
import { SiteConfigQuery } from './models/queries/site-config.query';

// Services
import { ProjectService } from './services/projects/project.service';
import { CaseStudyService } from './services/case-studies/case-study.service';
import { ContactService } from './services/contact/contact.service';
import { SiteConfigService } from './services/site-config/site-config.service';

// Controllers
import { ProjectsController } from './controller/projects/projects.controller';
import { CaseStudiesController } from './controller/case-studies/case-studies.controller';
import { ContactController } from './controller/contact/contact.controller';
import { SiteConfigController } from './controller/site-config/site-config.controller';

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
    CaseStudiesController,
    ContactController,
    SiteConfigController,
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
    CaseStudyQuery,
    ContactQuery,
    SiteConfigQuery,
    // Services
    ProjectService,
    CaseStudyService,
    ContactService,
    SiteConfigService,
  ],
})
export class AppModule {}

