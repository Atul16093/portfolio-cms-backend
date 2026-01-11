import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import knex, { Knex } from 'knex';

@Injectable()
export class DatabaseConnection implements OnModuleInit, OnModuleDestroy {
  private knexInstance: Knex;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const dbConfig = this.configService.get('database');
    
    this.knexInstance = knex({
      client: 'postgresql',
      connection: {
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.database,
        ssl: dbConfig.ssl,
      },
      pool: {
        min: 2,
        max: 10,
      },
    });

    // Test connection
    try {
      await this.knexInstance.raw('SELECT 1');
      console.log('Database connection established');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.knexInstance) {
      await this.knexInstance.destroy();
      console.log('Database connection closed');
    }
  }

  getKnex(): Knex {
    if (!this.knexInstance) {
      throw new Error('Database connection not initialized');
    }
    return this.knexInstance;
  }
}

