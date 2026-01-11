import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseService } from './core/response-management';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private responseService: ResponseService,
  ) {}

  @Get()
  getHello() {
    return this.responseService.success({
      message: this.appService.getHello(),
      version: '1.0.0',
    });
  }

  @Get('health')
  getHealth() {
    return this.responseService.success({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  }
}

