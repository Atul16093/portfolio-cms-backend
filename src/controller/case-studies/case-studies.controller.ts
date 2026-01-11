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
import { CaseStudyService } from '../../services/case-studies/case-study.service';
import { ResponseService } from '../../core/response-management';
import { ZodValidationPipe } from '../../common/validation/zod.pipe';
import {
  createCaseStudySchema,
  updateCaseStudySchema,
} from '../../common/validation/zod.schemas';
import { CaseStudyCreateInput, CaseStudyUpdateInput, CaseStudyQueryOptions } from '../../domain/case-studies/case-study.types';

@Controller('case-studies')
export class CaseStudiesController {
  constructor(
    private caseStudyService: CaseStudyService,
    private responseService: ResponseService,
  ) {}

  @Get()
  async findAll(@Query() query: CaseStudyQueryOptions) {
    const caseStudies = await this.caseStudyService.findAll(query);
    return this.responseService.success(caseStudies);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const caseStudy = await this.caseStudyService.findById(id);
    return this.responseService.success(caseStudy);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const caseStudy = await this.caseStudyService.findBySlug(slug);
    return this.responseService.success(caseStudy);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body(new ZodValidationPipe(createCaseStudySchema)) body: CaseStudyCreateInput) {
    const caseStudy = await this.caseStudyService.create(body);
    return this.responseService.created(caseStudy);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateCaseStudySchema)) body: CaseStudyUpdateInput,
  ) {
    const caseStudy = await this.caseStudyService.update(id, body);
    return this.responseService.updated(caseStudy);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.caseStudyService.delete(id);
    return this.responseService.deleted();
  }
}

