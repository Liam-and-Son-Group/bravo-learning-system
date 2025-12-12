# Lesson Creation - Backend Quick Reference

**📚 Full Documentation**:

- [API Specification](./lesson-creation-api-spec.md) - Complete API details
- [Flow Diagrams](./lesson-creation-flow-diagrams.md) - Visual flows and sequences

---

## 🚀 Quick Start

### What Frontend Will Send

```http
POST /service/v1/lessons
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "type": "assessment",
  "name": "Quiz 1 - Algebra",
  "mainBranch": "main",
  "visibility": "private",
  "folderId": "fld_abc123"
}
```

### What Backend Should Return

```json
{
  "success": true,
  "message": "Lesson created successfully",
  "data": {
    "id": "lesson_9x8y7z6",
    "type": "assessment",
    "name": "Quiz 1 - Algebra",
    "slug": "quiz-1-algebra",
    "mainBranch": "main",
    "visibility": "private",
    "folderId": "fld_abc123",
    "authorId": "user_xyz789",
    "organizationId": "org_school456",
    "status": "draft",
    "createdAt": "2025-12-07T10:30:00Z",
    "updatedAt": "2025-12-07T10:30:00Z",
    "version": {
      "id": "ver_1a2b3c",
      "number": 1,
      "name": "Initial version",
      "status": "draft"
    }
  }
}
```

---

## 📋 Required Endpoints

| Method | Endpoint                   | Purpose            | Status    |
| ------ | -------------------------- | ------------------ | --------- |
| `POST` | `/service/v1/lessons`      | Create new lesson  | ⏳ Needed |
| `GET`  | `/service/v1/folders`      | List folders       | ⏳ Needed |
| `GET`  | `/service/v1/lessons/{id}` | Get lesson details | ⏳ Needed |

---

## 🎯 Field Specifications

### Request Payload

| Field        | Type   | Required | Default     | Validation                                           |
| ------------ | ------ | -------- | ----------- | ---------------------------------------------------- |
| `type`       | enum   | ✅ Yes   | -           | `assessment`, `lesson`, `puzzle-game`, `custom-game` |
| `name`       | string | ✅ Yes   | -           | 1-200 chars, trimmed                                 |
| `mainBranch` | string | ❌ No    | `"main"`    | `^[a-z0-9-_]+$` (lowercase, numbers, `-`, `_`)       |
| `visibility` | enum   | ✅ Yes   | `"private"` | `public` or `private`                                |
| `folderId`   | string | ❌ No    | `""`        | UUID or empty (empty = root folder)                  |

### Response Fields (Auto-populated by Backend)

| Field            | Type      | Source    | Description                              |
| ---------------- | --------- | --------- | ---------------------------------------- |
| `id`             | string    | Generated | Unique lesson ID (e.g., `lesson_abc123`) |
| `slug`           | string    | Generated | URL-safe slug from name                  |
| `authorId`       | string    | JWT Token | User ID from authentication token        |
| `organizationId` | string    | JWT Token | Organization ID from token               |
| `status`         | enum      | Default   | Initial status: `draft`                  |
| `createdAt`      | timestamp | Auto      | ISO 8601 timestamp                       |
| `updatedAt`      | timestamp | Auto      | ISO 8601 timestamp                       |
| `version`        | object    | Auto      | Initial version record                   |

---

## ⚠️ Validation Rules

### Must Validate

✅ **Type**: Must be one of 4 allowed values  
✅ **Name**: Not empty, max 200 chars, trim whitespace  
✅ **Branch**: Lowercase alphanumeric + hyphens/underscores only  
✅ **Visibility**: Must be "public" or "private"  
✅ **Folder**: If provided, must exist and belong to user's org  
✅ **Authorization**: User must have content creation permission  
✅ **Authentication**: Valid JWT token required

### Auto-handle

🔧 **Slug**: Generate from name (lowercase, replace spaces with hyphens)  
🔧 **Author**: Extract from JWT token (DO NOT trust client input)  
🔧 **Organization**: Extract from JWT token (DO NOT trust client input)  
🔧 **Status**: Set to "draft" automatically  
🔧 **Version**: Create initial version record automatically

---

## 🔴 Error Codes

| HTTP | Error Code                 | Meaning              | Action                 |
| ---- | -------------------------- | -------------------- | ---------------------- |
| 400  | `VALIDATION_ERROR`         | Invalid input        | Show field errors      |
| 400  | `INVALID_LESSON_TYPE`      | Type not in enum     | Show type error        |
| 400  | `INVALID_LESSON_NAME`      | Name empty/too long  | Show name error        |
| 400  | `INVALID_BRANCH_NAME`      | Branch format wrong  | Show branch error      |
| 401  | `UNAUTHORIZED`             | No/invalid token     | Redirect to login      |
| 403  | `INSUFFICIENT_PERMISSIONS` | User can't create    | Show permission error  |
| 404  | `FOLDER_NOT_FOUND`         | Folder doesn't exist | Show folder error      |
| 409  | `DUPLICATE_LESSON_SLUG`    | Name already used    | Suggest different name |
| 500  | `INTERNAL_SERVER_ERROR`    | Server error         | Retry + log            |

### Error Response Format

```json
{
  "success": false,
  "message": "Validation failed",
  "errorCode": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "name",
      "message": "Lesson name is required"
    }
  ]
}
```

---

## 🗄️ Database Tables

### Lessons Table

```sql
CREATE TABLE lessons (
  id VARCHAR(255) PRIMARY KEY,
  type ENUM('assessment', 'lesson', 'puzzle-game', 'custom-game') NOT NULL,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  main_branch VARCHAR(100) NOT NULL DEFAULT 'main',
  visibility ENUM('public', 'private') NOT NULL DEFAULT 'private',
  folder_id VARCHAR(255) NULL,
  author_id VARCHAR(255) NOT NULL,
  organization_id VARCHAR(255) NOT NULL,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Lesson Versions Table

```sql
CREATE TABLE lesson_versions (
  id VARCHAR(255) PRIMARY KEY,
  lesson_id VARCHAR(255) NOT NULL,
  version_number INT NOT NULL,
  name VARCHAR(200) NOT NULL,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
  UNIQUE KEY (lesson_id, version_number)
);
```

---

## 🔄 Frontend Integration Flow

```
1. User opens dialog
   ↓
2. Frontend loads folders: GET /folders
   ↓
3. User fills form (type, name, branch, visibility, folder)
   ↓
4. User clicks "Create"
   ↓
5. Frontend validates locally
   ↓
6. Frontend sends: POST /lessons
   ↓
7. Backend validates + creates lesson + version
   ↓
8. Backend returns 201 + lesson data
   ↓
9. Frontend navigates to: /authoring/compose/{lessonId}
   ↓
10. Compose page loads: GET /lessons/{lessonId}
```

---

## 🧪 Test Scenarios

### Happy Path

```bash
# 1. Create private assessment in root folder
POST /lessons
{
  "type": "assessment",
  "name": "Test Quiz",
  "mainBranch": "main",
  "visibility": "private",
  "folderId": ""
}
# Expect: 201 with lesson ID

# 2. Create public lesson in specific folder
POST /lessons
{
  "type": "lesson",
  "name": "Intro to Math",
  "mainBranch": "math-101",
  "visibility": "public",
  "folderId": "fld_abc123"
}
# Expect: 201 with lesson ID
```

### Error Cases

```bash
# Missing type
POST /lessons { "name": "Test" }
# Expect: 400 INVALID_LESSON_TYPE

# Empty name
POST /lessons { "type": "lesson", "name": "" }
# Expect: 400 INVALID_LESSON_NAME

# Invalid branch (uppercase)
POST /lessons { "type": "lesson", "name": "Test", "mainBranch": "MAIN" }
# Expect: 400 INVALID_BRANCH_NAME

# Non-existent folder
POST /lessons { "type": "lesson", "name": "Test", "folderId": "fake_id" }
# Expect: 404 FOLDER_NOT_FOUND

# No auth token
POST /lessons (no Authorization header)
# Expect: 401 UNAUTHORIZED

# User without permission
POST /lessons (with student token)
# Expect: 403 INSUFFICIENT_PERMISSIONS
```

---

## 📞 Support

**Questions?** Contact:

- **Slack**: #bravo-authoring
- **Frontend Lead**: @frontend-team
- **Documentation**: See full specs linked at top

**Ready to implement?** Follow these steps:

1. ✅ Read this quick reference
2. ✅ Review [API Specification](./lesson-creation-api-spec.md)
3. ✅ Check [Flow Diagrams](./lesson-creation-flow-diagrams.md)
4. ✅ Ask questions in Slack
5. ✅ Implement endpoints
6. ✅ Update OpenAPI docs
7. ✅ Notify frontend team for integration

---

**Version**: 1.0  
**Last Updated**: December 7, 2025  
**Status**: Ready for Implementation
