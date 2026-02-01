import { Injectable } from '@nestjs/common';
import { PublicTechStackQuery, PublicTechStackGrouped } from '../../models/queries/public/public-tech-stack.query';

@Injectable()
export class PublicTechStackService {
  constructor(private readonly techStackQuery: PublicTechStackQuery) {}

  async getTechStack(): Promise<PublicTechStackGrouped> {
    return this.techStackQuery.findVisibleGrouped();
  }
}
