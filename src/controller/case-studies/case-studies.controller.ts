import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CaseStudyService } from '../../services/case-studies/case-study.service';
import { ResponseService } from '../../core/response-management';
import { ZodValidationPipe } from '../../common/validation/zod.pipe';
import {
  createCaseStudySchema,
  updateCaseStudySchema,
} from '../../common/validation/zod.schemas';
import { CaseStudyCreateInput, CaseStudyUpdateInput, CaseStudyQueryOptions } from '../../domain/case-studies/case-study.types';
import { StandardApiResponseDto } from '../../dtos/auth/auth-response.dto';

@ApiTags('case-studies')
@Controller('case-studies')
export class CaseStudiesController {
  constructor(
    private caseStudyService: CaseStudyService,
    private responseService: ResponseService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all case studies', description: 'Get a list of all case studies with optional filtering' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit number of results' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset for pagination' })
  @ApiResponse({ status: 200, description: 'List of case studies', type: StandardApiResponseDto })
  async findAll(@Query() query: CaseStudyQueryOptions) {
    const caseStudies = await this.caseStudyService.findAll(query);
    return this.responseService.success(caseStudies);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get case study by ID', description: 'Retrieve a specific case study by its ID' })
  @ApiParam({ name: 'id', description: 'Case study ID', type: String })
  @ApiResponse({ status: 200, description: 'Case study details', type: StandardApiResponseDto })
  @ApiResponse({ status: 404, description: 'Case study not found' })
  async findById(@Param('id') id: string) {
    const caseStudy = await this.caseStudyService.findById(id);
    return this.responseService.success(caseStudy);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get case study by slug', description: 'Retrieve a specific case study by its slug' })
  @ApiParam({ name: 'slug', description: 'Case study slug', type: String })
  @ApiResponse({ status: 200, description: 'Case study details', type: StandardApiResponseDto })
  @ApiResponse({ status: 404, description: 'Case study not found' })
  async findBySlug(@Param('slug') slug: string) {
    const caseStudy = await this.caseStudyService.findBySlug(slug);
    return this.responseService.success(caseStudy);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create new case study', description: 'Create a new case study (Admin only)' })
  @ApiResponse({ status: 201, description: 'Case study created successfully', type: StandardApiResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body(new ZodValidationPipe(createCaseStudySchema)) body: CaseStudyCreateInput) {
    const caseStudy = await this.caseStudyService.create(body);
    return this.responseService.created(caseStudy);
  }

  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update case study', description: 'Update an existing case study (Admin only)' })
  @ApiParam({ name: 'id', description: 'Case study ID', type: String })
  @ApiResponse({ status: 200, description: 'Case study updated successfully', type: StandardApiResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Case study not found' })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateCaseStudySchema)) body: CaseStudyUpdateInput,
  ) {
    const caseStudy = await this.caseStudyService.update(id, body);
    return this.responseService.updated(caseStudy);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete case study', description: 'Delete a case study by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'Case study ID', type: String })
  @ApiResponse({ status: 204, description: 'Case study deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Case study not found' })
  async delete(@Param('id') id: string) {
    await this.caseStudyService.delete(id);
    return this.responseService.deleted();
  }
}

