import { Controller, Post, Get, Put, Body, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AboutService } from '../../services/about/about.service';
import { CreateAboutDto, createAboutSchema } from '../../dtos/about/create-about.dto';
import { UpdateAboutDto, updateAboutSchema } from '../../dtos/about/update-about.dto';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';
import { ResponseService } from '../../core/response-management';
import { ZodValidationPipe } from '../../common/validation/zod.pipe';

@ApiTags('admin-about')
@Controller('admin/about')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AboutController {
  constructor(
    private readonly aboutService: AboutService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create or replace about content' })
  @ApiResponse({ status: 201, description: 'About content created successfully' })
  async create(@Body(new ZodValidationPipe(createAboutSchema)) body: CreateAboutDto) {
    const data = await this.aboutService.create(body);
    return this.responseService.created(data);
  }

  @Get()
  @ApiOperation({ summary: 'Fetch current about content' })
  @ApiResponse({ status: 200, description: 'About content retrieved successfully' })
  async find() {
    const data = await this.aboutService.getActive();
    return this.responseService.success(data);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update about content' })
  @ApiResponse({ status: 200, description: 'About content updated successfully' })
  async update(
    @Param('uuid') uuid: string,
    @Body(new ZodValidationPipe(updateAboutSchema)) body: UpdateAboutDto,
  ) {
    const data = await this.aboutService.update(uuid, body);
    return this.responseService.updated(data);
  }
}
