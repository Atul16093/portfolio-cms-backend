# CMS Projects API - cURL Testing Commands

## Prerequisites
- Replace `YOUR_ACCESS_TOKEN` with your actual JWT access token
- Replace `PROJECT_UUID` with an actual project UUID from your database
- Base URL: `http://localhost:3000/api` (adjust port if different)

---

## 1. Get Tech Stack (Grouped by Category)

```bash
curl -X GET "http://localhost:3000/api/cms/tech-stack" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "frontend": [
    { "id": 1, "name": "React", "category": "frontend", "iconUrl": "..." },
    { "id": 2, "name": "Vue", "category": "frontend", "iconUrl": "..." }
  ],
  "backend": [
    { "id": 3, "name": "Node.js", "category": "backend", "iconUrl": "..." }
  ]
}
```

---

## 2. Create Project

```bash
curl -X POST "http://localhost:3000/api/cms/projects" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Awesome Project",
    "slug": "my-awesome-project",
    "summary": "A brief description of the project",
    "status": "active",
    "isFeatured": false,
    "techStackIds": [1, 2, 3]
  }'
```

**Minimal Request (with defaults):**
```bash
curl -X POST "http://localhost:3000/api/cms/projects" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Awesome Project",
    "slug": "my-awesome-project"
  }'
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "code": "CREATED",
  "message": "Resource created successfully",
  "data": {
    "id": 1,
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "title": "My Awesome Project",
    "slug": "my-awesome-project",
    "summary": "A brief description",
    "isFeatured": false,
    "status": "active",
    "techStack": [
      { "id": 1, "name": "React", "category": "frontend", "iconUrl": "..." }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 3. Get All Projects (CMS List View)

```bash
curl -X GET "http://localhost:3000/api/cms/projects" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

**With Pagination:**
```bash
curl -X GET "http://localhost:3000/api/cms/projects?limit=10&offset=0" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Operation successful",
  "data": [
    {
      "uuid": "550e8400-e29b-41d4-a716-446655440000",
      "title": "My Awesome Project",
      "slug": "my-awesome-project",
      "isFeatured": false,
      "status": "active",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "techStack": [
        { "id": 1, "name": "React", "iconUrl": "..." }
      ]
    }
  ]
}
```

---

## 4. Get Single Project (For Edit Page)

```bash
curl -X GET "http://localhost:3000/api/cms/projects/PROJECT_UUID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

**Example:**
```bash
curl -X GET "http://localhost:3000/api/cms/projects/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Operation successful",
  "data": {
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "title": "My Awesome Project",
    "slug": "my-awesome-project",
    "summary": "A brief description",
    "isFeatured": false,
    "status": "active",
    "techStackIds": [1, 2, 3]
  }
}
```

---

## 5. Update Project

```bash
curl -X PUT "http://localhost:3000/api/cms/projects/PROJECT_UUID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Project Title",
    "slug": "updated-project-slug",
    "summary": "Updated summary",
    "status": "active",
    "isFeatured": true,
    "techStackIds": [1, 2, 4, 5]
  }'
```

**Example:**
```bash
curl -X PUT "http://localhost:3000/api/cms/projects/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Project Title",
    "slug": "updated-project-slug",
    "summary": "Updated summary",
    "status": "active",
    "isFeatured": true,
    "techStackIds": [1, 2, 4, 5]
  }'
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "code": "UPDATED",
  "message": "Resource updated successfully",
  "data": {
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Updated Project Title",
    "slug": "updated-project-slug",
    "summary": "Updated summary",
    "isFeatured": true,
    "status": "active",
    "techStackIds": [1, 2, 4, 5]
  }
}
```

---

## 6. Toggle Featured Status

```bash
curl -X PATCH "http://localhost:3000/api/cms/projects/PROJECT_UUID/featured" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

**Example:**
```bash
curl -X PATCH "http://localhost:3000/api/cms/projects/550e8400-e29b-41d4-a716-446655440000/featured" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "code": "SUCCESS",
  "message": "Operation successful",
  "data": {
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "isFeatured": true
  }
}
```

---

## Error Responses

### 401 Unauthorized (Missing/Invalid Token)
```json
{
  "statusCode": 401,
  "message": "Invalid or expired access token"
}
```

### 400 Bad Request (Validation Error)
```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "errors": [
    {
      "path": ["slug"],
      "message": "Slug must be lowercase and kebab-case only"
    }
  ]
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Project with UUID 550e8400-e29b-41d4-a716-446655440000 not found"
}
```

### 409 Conflict (Duplicate Slug)
```json
{
  "statusCode": 409,
  "message": "Project with this slug already exists"
}
```

### 400 Bad Request (Invalid Tech Stack IDs)
```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Tech stack IDs not found: 1, 2, 3. Please use valid tech stack IDs.",
  "errors": [
    {
      "field": "techStackIds",
      "message": "The following tech stack IDs do not exist: 1, 2, 3",
      "code": "INVALID_TECH_STACK_IDS"
    }
  ],
  "timestamp": "2024-01-19T01:55:38.000Z"
}
```

**Solution**: Call `GET /api/cms/tech-stack` first to see available IDs, or create the project without `techStackIds`.

---

## Important Notes

⚠️ **Tech Stack IDs**: Before creating a project with `techStackIds`, you must:
1. First call `GET /api/cms/tech-stack` to see available tech stack items and their IDs
2. Use only IDs that exist in the database
3. If no tech stack items exist, either:
   - Create the project without `techStackIds` (it's optional)
   - Or seed your database with tech stack items first

## Quick Test Sequence

1. **Get Tech Stack** (to get valid tech stack IDs - REQUIRED FIRST STEP):
```bash
curl -X GET "http://localhost:3000/api/cms/tech-stack" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Note**: If this returns empty groups `{}`, you need to seed tech stack data first, or create projects without `techStackIds`.

2. **Create Project** (use IDs from step 1, or omit techStackIds):
```bash
curl -X POST "http://localhost:3000/api/cms/projects" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Project",
    "slug": "test-project",
    "techStackIds": [1, 2]
  }'
```

3. **Get All Projects** (to get the UUID):
```bash
curl -X GET "http://localhost:3000/api/cms/projects" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

4. **Get Single Project** (replace UUID):
```bash
curl -X GET "http://localhost:3000/api/cms/projects/YOUR_PROJECT_UUID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

5. **Update Project** (replace UUID):
```bash
curl -X PUT "http://localhost:3000/api/cms/projects/YOUR_PROJECT_UUID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Test Project",
    "slug": "updated-test-project",
    "status": "active",
    "isFeatured": true,
    "techStackIds": [1, 2, 3]
  }'
```

6. **Toggle Featured** (replace UUID):
```bash
curl -X PATCH "http://localhost:3000/api/cms/projects/YOUR_PROJECT_UUID/featured" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Notes

- All endpoints require authentication via Bearer token
- Replace `YOUR_ACCESS_TOKEN` with a valid JWT token from `/api/admin/auth/login`
- Replace `PROJECT_UUID` with actual UUIDs from your database
- Slug must be lowercase, kebab-case only (e.g., `my-awesome-project`)
- Title must be at least 3 characters
- Tech stack IDs must exist in the `tech_stack` table
- All timestamps are in ISO 8601 format
