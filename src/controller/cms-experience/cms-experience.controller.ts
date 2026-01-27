import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CmsExperienceService } from '../../services/cms-experience/cms-experience.service';
import { ResponseService } from '../../core/response-management';
import { ZodValidationPipe } from '../../common/validation/zod.pipe';
import { createExperienceSchema, CreateExperienceDto } from '../../dtos/experience/create-experience.dto';
import { updateExperienceSchema, UpdateExperienceDto } from '../../dtos/experience/update-experience.dto';
import { toggleVisibilitySchema, ToggleVisibilityDto } from '../../dtos/experience/toggle-visibility.dto';
import { StandardApiResponseDto } from '../../dtos/auth/auth-response.dto';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';

/**
 * CMS Controller for Experience Management
 * Routes requests to service layer - NO business logic here
 * All routes are admin-only (protected by AdminAuthGuard)
 */
@ApiTags('cms-experience')
@Controller('cms/experience')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('JWT-auth')
export class CmsExperienceController {
  constructor(
    private cmsExperienceService: CmsExperienceService,
    private responseService: ResponseService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all experiences',
    description: 'Retrieve all experiences ordered by order_index ASC (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of experiences',
    type: StandardApiResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll() {
    const experiences = await this.cmsExperienceService.findAll();
    return this.responseService.success(experiences);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get experience by ID',
    description: 'Retrieve a single experience. ID in path/response is uuid (numeric id not exposed).',
  })
  @ApiParam({ name: 'id', description: 'Experience ID (uuid value)', type: String })
  @ApiResponse({
    status: 200,
    description: 'Experience details',
    type: StandardApiResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Experience not found' })
  async findOne(@Param('id') id: string) {
    const experience = await this.cmsExperienceService.findOne(id);
    return this.responseService.success(experience);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new experience',
    description: 'Create a new experience entry (Admin only)',
  })
  @ApiResponse({
    status: 201,
    description: 'Experience created successfully',
    type: StandardApiResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body(new ZodValidationPipe(createExperienceSchema)) body: CreateExperienceDto) {
    // Validation handled by ZodValidationPipe
    // Business logic handled by service layer
    const experience = await this.cmsExperienceService.create(body);
    return this.responseService.created(experience);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update an experience',
    description: 'Update by ID (id is uuid). All fields required, no partial updates.',
  })
  @ApiParam({ name: 'id', description: 'Experience ID (uuid value)', type: String })
  @ApiResponse({
    status: 200,
    description: 'Experience updated successfully',
    type: StandardApiResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Experience not found' })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateExperienceSchema)) body: UpdateExperienceDto,
  ) {
    const experience = await this.cmsExperienceService.update(id, body);
    return this.responseService.updated(experience);
  }

  @Patch(':id/visibility')
  @ApiOperation({
    summary: 'Toggle experience visibility',
    description: 'Update visibility by ID (id is uuid).',
  })
  @ApiParam({ name: 'id', description: 'Experience ID (uuid value)', type: String })
  @ApiResponse({
    status: 200,
    description: 'Visibility status updated successfully',
    type: StandardApiResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Experience not found' })
  async toggleVisibility(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(toggleVisibilitySchema)) body: ToggleVisibilityDto,
  ) {
    const experience = await this.cmsExperienceService.toggleVisibility(id, body);
    return this.responseService.success(experience);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete an experience',
    description: 'Delete by ID (id is uuid, hard delete).',
  })
  @ApiParam({ name: 'id', description: 'Experience ID (uuid value)', type: String })
  @ApiResponse({
    status: 200,
    description: 'Experience deleted successfully',
    type: StandardApiResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Experience not found' })
  async delete(@Param('id') id: string) {
    await this.cmsExperienceService.delete(id);
    return this.responseService.deleted();
  }
}
