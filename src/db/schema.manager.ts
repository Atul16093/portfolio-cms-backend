import { Injectable } from '@nestjs/common';
import { DatabaseConnection } from './database.connection';
import { Knex } from 'knex';

@Injectable()
export class SchemaManager {
  constructor(private dbConnection: DatabaseConnection) {}

  getKnex(): Knex {
    return this.dbConnection.getKnex();
  }

  async createTableIfNotExists(tableName: string, callback: (table: Knex.CreateTableBuilder) => void): Promise<void> {
    const knex = this.getKnex();
    const exists = await knex.schema.hasTable(tableName);
    
    if (!exists) {
      await knex.schema.createTable(tableName, callback);
    }
  }

  async dropTableIfExists(tableName: string): Promise<void> {
    const knex = this.getKnex();
    const exists = await knex.schema.hasTable(tableName);
    
    if (exists) {
      await knex.schema.dropTable(tableName);
    }
  }
}

