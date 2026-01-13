import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ResponseService } from './core/response-management';
import { StandardApiResponseDto } from './dtos/auth/auth-response.dto';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private responseService: ResponseService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get API info', description: 'Returns API version and welcome message' })
  @ApiResponse({ status: 200, description: 'API information', type: StandardApiResponseDto })
  getHello() {
    return this.responseService.success({
      message: this.appService.getHello(),
      version: '1.0.0',
    });
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check', description: 'Returns API health status' })
  @ApiResponse({ status: 200, description: 'Health check response', type: StandardApiResponseDto })
  getHealth() {
    return this.responseService.success({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  }
}

