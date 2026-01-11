# Portfolio Backend

Production-grade NestJS monolithic backend with strict layered architecture.

## Architecture

This backend follows a **strict layered monolith** design:

```
HTTP Request → Controller → Service → Model/Query → Database
```

### Layer Responsibilities

- **Controllers** (`/api`): Routing and validation only
- **Services** (`/services`): Business logic and orchestration
- **Models/Queries** (`/models`): Database access using Knex
- **Database** (`/db`): Knex initialization and schema management

## Tech Stack

- **Framework**: NestJS (monolith)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM/Query Builder**: Knex
- **Validation**: Zod
- **Config**: @nestjs/config

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
PORT=3000
NODE_ENV=development
API_PREFIX=api

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=portfolio_db
DB_SSL=false
```

3. Run database migrations:
```bash
npm run migration:latest
```

4. Start the server:
```bash
npm run start:dev
```

## Project Structure

```
/src
  /api              # Controllers (routing layer)
  /services         # Business logic layer
  /models           # Database query layer
  /db               # Database connection & migrations
  /core             # Response management & shared infrastructure
  /domain            # Domain contracts & types
  /common           # Cross-cutting concerns
  /config           # Configuration
```

## API Endpoints

- `GET /api/projects` - List projects
- `GET /api/projects/:id` - Get project by ID
- `GET /api/projects/slug/:slug` - Get project by slug
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

- `GET /api/case-studies` - List case studies
- `GET /api/case-studies/:id` - Get case study by ID
- `GET /api/case-studies/slug/:slug` - Get case study by slug
- `POST /api/case-studies` - Create case study
- `PUT /api/case-studies/:id` - Update case study
- `DELETE /api/case-studies/:id` - Delete case study

- `POST /api/contact` - Submit contact form
- `GET /api/contact` - List contact submissions

- `GET /api/site-config` - Get site configuration
- `PUT /api/site-config` - Update site configuration

## Response Format

All responses follow a standardized format:

```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2024-01-12T00:00:00.000Z",
  "path": "/api/projects"
}
```

## Validation

All request validation uses Zod schemas. Validation errors are automatically formatted and returned in the standard response format.

## Database Migrations

Create a new migration:
```bash
npm run migration:make migration_name
```

Run migrations:
```bash
npm run migration:latest
```

Rollback migrations:
```bash
npm run migration:rollback
```

## Development

- `npm run build` - Build the project
- `npm run start:dev` - Start in development mode with watch
- `npm run start:prod` - Start in production mode

