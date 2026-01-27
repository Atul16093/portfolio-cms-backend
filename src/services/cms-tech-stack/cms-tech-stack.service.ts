import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { DatabaseConnection } from '../../db/database.connection';
import { TechStackQuery, TechStackGrouped } from '../../models/queries/tech-stack.query';
import { CreateTechStackDto } from '../../dtos/tech-stack/create-tech-stack.dto';
import { UpdateTechStackDto } from '../../dtos/tech-stack/update-tech-stack.dto';
import { ToggleTechStackVisibilityDto } from '../../dtos/tech-stack/toggle-visibility.dto';
import { ReorderTechStackBodyDto } from '../../dtos/tech-stack/reorder-tech-stack.dto';

/**
 * Service layer for CMS tech stack operations.
 * Enforces uniqueness of name, prevents delete if linked, wraps reorder in transaction.
 */
@Injectable()
export class CmsTechStackService {
  constructor(
    private techStackQuery: TechStackQuery,
    private dbConnection: DatabaseConnection,
  ) {}

  /**
   * List tech stack grouped by category, visible only by default, sorted by priority ASC
   */
  async getGrouped(visibleOnly: boolean = true): Promise<TechStackGrouped> {
    return this.techStackQuery.getGroupedVisible(visibleOnly);
  }

  /**
   * Create tech item. Enforces name uniqueness.
   */
  async create(input: CreateTechStackDto): Promise<any> {
    const existing = await this.techStackQuery.findByName(input.name);
    if (existing) {
      throw new ConflictException(`Tech stack item with name "${input.name}" already exists`);
    }
    return this.techStackQuery.create(input);
  }

  /**
   * Update tech item by id. Enforces name uniqueness when name changes.
   */
  async update(id: number, input: UpdateTechStackDto): Promise<any> {
    const existing = await this.techStackQuery.findById(id);
    if (!existing) {
      throw new NotFoundException(`Tech stack item with ID ${id} not found`);
    }
    if (input.name !== existing.name) {
      const byName = await this.techStackQuery.findByName(input.name);
      if (byName && byName.id !== id) {
        throw new ConflictException(`Tech stack item with name "${input.name}" already exists`);
      }
    }
    const updated = await this.techStackQuery.updateById(id, input);
    if (!updated) throw new NotFoundException(`Tech stack item with ID ${id} not found`);
    return updated;
  }

  /**
   * Toggle visibility by id
   */
  async toggleVisibility(id: number, input: ToggleTechStackVisibilityDto): Promise<any> {
    const existing = await this.techStackQuery.findById(id);
    if (!existing) {
      throw new NotFoundException(`Tech stack item with ID ${id} not found`);
    }
    const updated = await this.techStackQuery.updateVisibility(id, input.is_visible);
    if (!updated) throw new NotFoundException(`Tech stack item with ID ${id} not found`);
    return updated;
  }

  /**
   * Reorder tech stack (batch update). Runs in a transaction.
   */
  async reorder(body: ReorderTechStackBodyDto): Promise<{ updated: number }> {
    if (!body || body.length === 0) {
      throw new BadRequestException('Reorder payload must be a non-empty array of { id, priority }');
    }
    const trx = await this.dbConnection.getKnex().transaction();
    try {
      await this.techStackQuery.reorderBatch(trx, body);
      await trx.commit();
      return { updated: body.length };
    } catch (e) {
      await trx.rollback();
      throw e;
    }
  }

  /**
   * Delete tech item only if not used in project_tech_stack.
   */
  async delete(id: number): Promise<void> {
    const existing = await this.techStackQuery.findById(id);
    if (!existing) {
      throw new NotFoundException(`Tech stack item with ID ${id} not found`);
    }
    const deleted = await this.techStackQuery.deleteIfUnused(id);
    if (deleted === 0) {
      throw new ConflictException('Cannot delete: tech stack item is used by one or more projects');
    }
  }
}
