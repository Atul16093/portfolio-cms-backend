import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CmsTechStackService } from '../../services/cms-tech-stack/cms-tech-stack.service';
import { ResponseService } from '../../core/response-management';
import { ZodValidationPipe } from '../../common/validation/zod.pipe';
import { createTechStackSchema, CreateTechStackDto } from '../../dtos/tech-stack/create-tech-stack.dto';
import { updateTechStackSchema, UpdateTechStackDto } from '../../dtos/tech-stack/update-tech-stack.dto';
import { toggleTechStackVisibilitySchema, ToggleTechStackVisibilityDto } from '../../dtos/tech-stack/toggle-visibility.dto';
import { reorderTechStackBodySchema, ReorderTechStackBodyDto } from '../../dtos/tech-stack/reorder-tech-stack.dto';
import { StandardApiResponseDto } from '../../dtos/auth/auth-response.dto';
import { AdminAuthGuard } from '../../common/guards/admin-auth.guard';

/**
 * CMS Controller for Tech Stack
 * Thin controller: routing only. AdminAuthGuard on all routes.
 */
@ApiTags('cms-tech-stack')
@Controller('cms/tech-stack')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('JWT-auth')
export class CmsTechStackController {
  constructor(
    private cmsTechStackService: CmsTechStackService,
    private responseService: ResponseService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'List tech stack grouped by category',
    description: 'Returns grouped by category, visible only by default, sort by priority ASC',
  })
  @ApiQuery({ name: 'visibleOnly', required: false, type: Boolean, description: 'Include only visible (default true)' })
  @ApiResponse({ status: 200, description: 'Tech stack grouped by category', type: StandardApiResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getGrouped(@Query('visibleOnly') visibleOnly?: string) {
    const only = visibleOnly !== 'false';
    const data = await this.cmsTechStackService.getGrouped(only);
    return this.responseService.success(data);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create tech item' })
  @ApiResponse({ status: 201, description: 'Tech item created', type: StandardApiResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Name already exists' })
  async create(@Body(new ZodValidationPipe(createTechStackSchema)) body: CreateTechStackDto) {
    const data = await this.cmsTechStackService.create(body);
    return this.responseService.created(data);
  }

  @Patch('reorder')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reorder tech stack (batch update)' })
  @ApiResponse({ status: 200, description: 'Reorder applied', type: StandardApiResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async reorder(@Body(new ZodValidationPipe(reorderTechStackBodySchema)) body: ReorderTechStackBodyDto) {
    const data = await this.cmsTechStackService.reorder(body);
    return this.responseService.success(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update tech item' })
  @ApiParam({ name: 'id', description: 'Tech stack item ID', type: Number })
  @ApiResponse({ status: 200, description: 'Tech item updated', type: StandardApiResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 409, description: 'Name already exists' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateTechStackSchema)) body: UpdateTechStackDto,
  ) {
    const data = await this.cmsTechStackService.update(id, body);
    return this.responseService.updated(data);
  }

  @Patch(':id/visibility')
  @ApiOperation({ summary: 'Toggle visibility' })
  @ApiParam({ name: 'id', description: 'Tech stack item ID', type: Number })
  @ApiResponse({ status: 200, description: 'Visibility updated', type: StandardApiResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async toggleVisibility(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(toggleTechStackVisibilitySchema)) body: ToggleTechStackVisibilityDto,
  ) {
    const data = await this.cmsTechStackService.toggleVisibility(id, body);
    return this.responseService.success(data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete tech item' })
  @ApiParam({ name: 'id', description: 'Tech stack item ID', type: Number })
  @ApiResponse({ status: 200, description: 'Tech item deleted', type: StandardApiResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 409, description: 'Item is used by projects' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.cmsTechStackService.delete(id);
    return this.responseService.deleted();
  }
}
