import { Injectable } from '@nestjs/common';
import { PublicExperienceQuery } from '../../models/queries/public/public-experience.query';

@Injectable()
export class PublicExperienceService {
  constructor(private readonly experienceQuery: PublicExperienceQuery) {}

  async getAllExperience(): Promise<any[]> {
    return this.experienceQuery.findAllVisible();
  }
}
