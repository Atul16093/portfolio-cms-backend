# Activity Tracking System

## Overview

The system tracks user activities and system events in a dedicated `activity_logs` table. Activities are logged when specific events occur (project creation, updates, contact submissions, admin logins, etc.).

---

## Current Implementation

### 1. **Activity Logs Table** (`data.activity_logs`)

**Migration:** `20260112000011_create_activity_logs_table.ts`

**Structure:**
- `id` (integer, primary key)
- `uuid` (UUID, unique)
- `activity_type` (string) - Type of activity
- `message` (text) - Human-readable message
- `entity_type` (string, nullable) - Type of entity (e.g., 'project', 'contact', 'session')
- `entity_id` (integer, nullable) - ID of the related entity
- `entity_label` (string, nullable) - Human-readable label (e.g., project title)
- `admin_user_id` (integer, nullable) - Admin who performed the action
- `metadata` (JSONB, nullable) - Additional context data
- `created_at` (timestamp)

**Indexes:**
- `activity_type` - For filtering by activity type
- `created_at DESC` - For recent activities query
- `admin_user_id` - For user-specific activity queries

---

### 2. **Activity Types Tracked**

| Activity Type | When Logged | Entity Type |
|--------------|-------------|-------------|
| `PROJECT_CREATED` | When project is created with inactive status | `project` |
| `PROJECT_PUBLISHED` | When project is created with active status | `project` |
| `PROJECT_UPDATED` | When project is updated | `project` |
| `PROJECT_UNPUBLISHED` | When project status changes to inactive | `project` |
| `CONTACT_RECEIVED` | When new contact form is submitted | `contact` |
| `ADMIN_LOGIN` | When admin logs in | `session` |
| `ADMIN_LOGOUT` | When admin logs out | `session` |
| `SESSION_REVOKED` | When session is revoked | `session` |

---

### 3. **How Activities Are Logged**

#### **Project Activities**

**Location:** `src/services/cms-projects/projects.service.ts`

**When Project is Created:**
```typescript
// In ProjectsService.create()
await this.activityLogService.logProjectActivity(
  projectData.status === 'active' ? 'PROJECT_PUBLISHED' : 'PROJECT_CREATED',
  projectRow.id,
  projectData.title,
  undefined, // adminUserId (can be passed from controller)
  trx, // Transaction for atomicity
);
```

**When Project is Updated:**
```typescript
// In CmsProjectsService.update()
await this.activityLogService.logProjectActivity(
  'PROJECT_UPDATED',
  updatedProjectRow.id,
  input.title || existingProject.title,
  undefined, // adminUserId (can be passed from controller)
  trx,
);
```

#### **Contact Activities**

**Location:** `src/services/contact/contact.service.ts`

**When Contact is Received:**
```typescript
// In ContactService.create()
await this.activityLogService.logContactActivity(
  contactId,
  contact.name,
  contact.email,
);
```

#### **Session Activities**

**Location:** `src/services/auth/auth.service.ts`

**When Admin Logs In:**
```typescript
// In AuthService.login()
await this.activityLogService.logSessionActivity(
  'ADMIN_LOGIN',
  adminUser.id,
  sessionId,
);
```

**When Admin Logs Out:**
```typescript
// In AuthService.logout()
await this.activityLogService.logSessionActivity(
  'SESSION_REVOKED',
  payload.sub, // admin user ID
  payload.sessionId,
);
```

---

### 4. **Activity Log Service**

**Location:** `src/services/activity-log/activity-log.service.ts`

**Methods:**
- `logProjectActivity()` - Logs project-related activities
- `logContactActivity()` - Logs contact-related activities
- `logSessionActivity()` - Logs session-related activities
- `logActivity()` - Generic method for custom activity types

**Features:**
- Supports transaction-based logging (for atomicity)
- Formats activity messages automatically
- Stores entity references for linking

---

### 5. **Activity Log Query**

**Location:** `src/models/queries/activity-log.query.ts`

**Methods:**
- `create()` - Create activity log entry
- `createInTransaction()` - Create within transaction
- `getRecent()` - Get recent activities
- `getByActivityType()` - Filter by activity type
- `getByAdminUserId()` - Filter by admin user

---

### 6. **Dashboard Activity Feed**

**Location:** `src/models/queries/dashboard.query.ts`

**How it Works:**
1. **Primary Method:** Queries `activity_logs` table directly
2. **Fallback Method:** If table doesn't exist, derives activities from existing tables (backward compatibility)

**Query:**
```typescript
// Tries to query activity_logs table first
const activityLogs = await this.knex('data.activity_logs')
  .select('activity_type as type', 'message', 'entity_id', 'entity_label', 'created_at')
  .orderBy('created_at', 'desc')
  .limit(limit);
```

---

## How to Use Activity Logging

### **In Services (Recommended)**

```typescript
// Inject ActivityLogService
constructor(
  private activityLogService: ActivityLogService,
) {}

// Log activity within transaction
await this.activityLogService.logProjectActivity(
  'PROJECT_UPDATED',
  projectId,
  projectTitle,
  adminUserId, // Optional: from request.admin.id
  trx, // Optional: for transaction support
);
```

### **Passing Admin User ID from Controller**

To track which admin performed an action:

```typescript
// In Controller
@UseGuards(AdminAuthGuard)
async update(@Req() req: Request, @Param('uuid') uuid: string, @Body() body: UpdateDto) {
  const adminUserId = req.admin?.id; // From AdminAuthGuard
  const result = await this.service.update(uuid, body, adminUserId);
  return this.responseService.success(result);
}

// In Service
async update(uuid: string, input: UpdateDto, adminUserId?: number) {
  // ... update logic ...
  await this.activityLogService.logProjectActivity(
    'PROJECT_UPDATED',
    projectId,
    projectTitle,
    adminUserId, // Pass from controller
    trx,
  );
}
```

---

## Migration Steps

1. **Run Migration:**
   ```bash
   npm run migration:latest
   ```

2. **Activities Start Logging:**
   - New activities are logged automatically
   - Existing activities are NOT backfilled (only new ones)

3. **Dashboard Uses Activity Logs:**
   - Dashboard activity feed reads from `activity_logs` table
   - Falls back to deriving from timestamps if table doesn't exist

---

## Activity Log Entry Example

```json
{
  "id": 1,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "activity_type": "PROJECT_CREATED",
  "message": "Project \"My Awesome Project\" was created",
  "entity_type": "project",
  "entity_id": 5,
  "entity_label": "My Awesome Project",
  "admin_user_id": 1,
  "metadata": null,
  "created_at": "2024-01-19T12:00:00.000Z"
}
```

---

## Benefits

1. **Centralized Tracking:** All activities in one table
2. **Rich Context:** Entity references, admin user tracking, metadata
3. **Queryable:** Easy to filter by type, user, entity, date
4. **Audit Trail:** Complete history of system actions
5. **Performance:** Indexed for fast queries
6. **Extensible:** Easy to add new activity types

---

## Future Enhancements

- Add activity filtering by date range
- Add activity search functionality
- Add activity export functionality
- Add activity statistics/analytics
- Add activity notifications for specific events
