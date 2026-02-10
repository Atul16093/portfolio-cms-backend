import { Injectable, NotFoundException } from '@nestjs/common';
import { AboutQuery } from '../../models/queries/about.query';
import { CreateAboutDto } from '../../dtos/about/create-about.dto';
import { UpdateAboutDto } from '../../dtos/about/update-about.dto';

@Injectable()
export class AboutService {
  constructor(private readonly aboutQuery: AboutQuery) {}

  /**
   * Create a new About record.
   * If the new record is active, all other records will be deactivated.
   */
  async create(dto: CreateAboutDto) {
    const newItem = await this.aboutQuery.createAbout(dto);

    if (newItem.isActive) {
      await this.aboutQuery.deactivateAllExcept(newItem.uuid);
    }

    return newItem;
  }

  /**
   * Get the currently active About record.
   */
  async getActive() {
    return this.aboutQuery.getActiveAbout();
  }

  /**
   * Get a specific About record by UUID.
   */
  async getOne(uuid: string) {
    const item = await this.aboutQuery.getAbout(uuid);
    if (!item) {
      throw new NotFoundException('About content not found');
    }
    return item;
  }

  /**
   * Update an About record.
   * If set to active, ensures others are deactivated.
   */
  async update(uuid: string, dto: UpdateAboutDto) {
    const existing = await this.aboutQuery.getAbout(uuid);
    if (!existing) {
      throw new NotFoundException('About content not found');
    }

    const updated = await this.aboutQuery.updateAbout(uuid, dto);

    if (updated.isActive) {
      await this.aboutQuery.deactivateAllExcept(updated.uuid);
    }

    return updated;
  }
}
