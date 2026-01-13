import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 5000;
  const apiPrefix = configService.get<string>('app.apiPrefix') || 'api';

  // Global prefix
  app.setGlobalPrefix(apiPrefix);

  // CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global validation pipe (for any class-validator usage if needed)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger/OpenAPI Configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Portfolio Backend API')
    .setDescription('Production-grade NestJS monolithic backend API documentation for Portfolio CMS')
    .setVersion('1.0.0')
    .addTag('auth', 'Admin authentication endpoints')
    .addTag('projects', 'Project management endpoints')
    .addTag('case-studies', 'Case study management endpoints')
    .addTag('contact', 'Contact form endpoints')
    .addTag('site-config', 'Site configuration endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT access token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .addServer(`http://localhost:${port}`, 'Development server')
    .addServer('https://api.yourdomain.com', 'Production server')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Portfolio Backend API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/${apiPrefix}`);
  console.log(`Swagger documentation: http://localhost:${port}/${apiPrefix}/docs`);
}

bootstrap();

