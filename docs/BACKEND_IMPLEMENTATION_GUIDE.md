# 🚀 Backend Implementation Guide - Lesson Creation APIs

**For**: Backend Development Team  
**Status**: Ready for Implementation  
**Priority**: High  
**Estimated Effort**: 2-3 days  
**Dependencies**: None (standalone feature)

---

## 📋 Executive Summary

Frontend has completed a multi-step lesson creation modal. We need 3 backend APIs to make it functional:

1. ✅ **Create Lesson** - `POST /service/v1/lessons` (PRIMARY)
2. ✅ **List Folders** - `GET /service/v1/folders` (supporting)
3. ✅ **Get Lesson** - `GET /service/v1/lessons/{id}` (supporting)

**Expected Timeline**: APIs ready for integration testing by **December 14, 2025**

---

## 🎯 What Frontend Built

### User Experience Flow

```
Teacher clicks "Create new lesson"
  ↓
Modal Step 1: Choose type (Assessment/Lesson/Puzzle Game/Custom Game)
  ↓
Modal Step 2: Configure (name, branch, visibility, folder)
  ↓
Submit → Create lesson via API
  ↓
Navigate to compose page
```

### What We Need From Backend

**When user clicks "Create"**:

- Frontend sends lesson data
- Backend creates lesson + initial version
- Backend returns lesson ID
- Frontend navigates to `/authoring/compose/{lessonId}`

---

## 📚 Documentation Package

We've prepared **4 comprehensive documents** for you:

### 1. 🚀 [Quick Reference](./lesson-creation-quick-reference.md)

**READ THIS FIRST** - 5 minutes

- Essential field specs
- Validation rules
- Error codes
- Example requests/responses
- Database schemas

**Perfect for**: Quick implementation start

---

### 2. 📋 [API Specification](./lesson-creation-api-spec.md)

**COMPLETE REFERENCE** - 15 minutes

- Full endpoint documentation
- Detailed validation rules
- All error scenarios
- Integration code examples
- Backend checklist

**Perfect for**: Implementation details

---

### 3. 🎨 [Flow Diagrams](./lesson-creation-flow-diagrams.md)

**VISUAL GUIDE** - 10 minutes

- Mermaid flowcharts
- Sequence diagrams
- State transitions
- Error flow handling

**Perfect for**: Understanding the big picture

---

### 4. 💻 [Frontend Implementation](./lesson-creation-feature.md)

**FRONTEND DETAILS** - 10 minutes

- Component structure
- Form data shape
- UI/UX patterns
- Testing checklist

**Perfect for**: Understanding what frontend does

---

## 🎬 Getting Started (3 Steps)

### Step 1: Quick Read (15 minutes)

```bash
1. Open: lesson-creation-quick-reference.md
   → Get field specs, validation, errors

2. Open: lesson-creation-flow-diagrams.md
   → See the sequence diagram
   → Understand data flow
```

### Step 2: Deep Dive (30 minutes)

```bash
3. Open: lesson-creation-api-spec.md
   → Read "API Endpoints Required" section
   → Review "Validation Rules" section
   → Check "Error Handling" section
```

### Step 3: Ask Questions (15 minutes)

```bash
4. Review with team
5. Ask questions in #bravo-authoring Slack
6. Get clarifications before coding
```

**Total prep time**: ~1 hour before writing code

---

## 🔥 Priority Endpoint Details

### 1️⃣ POST /service/v1/lessons (CRITICAL)

**Purpose**: Create new lesson/assessment/game

**Request**:

```json
{
  "type": "assessment", // REQUIRED: enum
  "name": "Quiz 1", // REQUIRED: string, 1-200 chars
  "mainBranch": "main", // OPTIONAL: default "main"
  "visibility": "private", // REQUIRED: enum, default "private"
  "folderId": "fld_abc123" // OPTIONAL: UUID or empty
}
```

**Response (201)**:

```json
{
  "success": true,
  "message": "Lesson created successfully",
  "data": {
    "id": "lesson_xyz789",
    "type": "assessment",
    "name": "Quiz 1",
    "slug": "quiz-1",
    "mainBranch": "main",
    "visibility": "private",
    "folderId": "fld_abc123",
    "authorId": "user_123",
    "organizationId": "org_456",
    "status": "draft",
    "createdAt": "2025-12-07T10:30:00Z",
    "updatedAt": "2025-12-07T10:30:00Z",
    "version": {
      "id": "ver_001",
      "number": 1,
      "name": "Initial version",
      "status": "draft"
    }
  }
}
```

**Key Points**:

- Extract `authorId` and `organizationId` from JWT (don't trust client)
- Generate `slug` from `name` (lowercase, hyphens)
- Create initial version record automatically
- Return full lesson object with version

---

### 2️⃣ GET /service/v1/folders (SUPPORTING)

**Purpose**: Populate folder dropdown in modal

**Request**:

```http
GET /service/v1/folders?organizationId=org_456
```

**Response (200)**:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "fld_abc123",
        "name": "Grade 10 - Mathematics",
        "parentId": null
      }
    ],
    "pagination": { ... }
  }
}
```

---

### 3️⃣ GET /service/v1/lessons/{id} (SUPPORTING)

**Purpose**: Load lesson data in compose page

**Request**:

```http
GET /service/v1/lessons/lesson_xyz789
```

**Response (200)**:

```json
{
  "success": true,
  "data": {
    "id": "lesson_xyz789",
    "type": "assessment",
    "name": "Quiz 1",
    ... (all fields)
  }
}
```

---

## ✅ Implementation Checklist

### Database (Day 1 - Morning)

- [ ] Create `lessons` table with all fields
- [ ] Create `folders` table (if not exists)
- [ ] Create `lesson_versions` table
- [ ] Add foreign keys and indexes
- [ ] Write migration scripts

### Endpoints (Day 1 - Afternoon + Day 2)

- [ ] Implement POST /service/v1/lessons
  - [ ] JWT authentication middleware
  - [ ] Request validation (type, name, branch, visibility, folder)
  - [ ] Permission check (content.create)
  - [ ] Slug generation
  - [ ] Database insert (lesson + version)
  - [ ] Response formatting
- [ ] Implement GET /service/v1/folders
  - [ ] Query by organization
  - [ ] Pagination support
  - [ ] Access control
- [ ] Implement GET /service/v1/lessons/{id}
  - [ ] Fetch lesson with versions
  - [ ] Join folder data
  - [ ] Access control

### Error Handling (Day 2)

- [ ] 400 Bad Request (validation errors)
- [ ] 401 Unauthorized (no token)
- [ ] 403 Forbidden (no permissions)
- [ ] 404 Not Found (folder/lesson)
- [ ] 409 Conflict (duplicate slug)
- [ ] 500 Internal Server Error

### Testing (Day 3)

- [ ] Unit tests for validation
- [ ] Integration tests for endpoints
- [ ] Test authentication/authorization
- [ ] Test error scenarios
- [ ] Manual testing with Postman

### Documentation (Day 3)

- [ ] Update OpenAPI/Swagger
- [ ] Add example requests
- [ ] Document error codes
- [ ] Notify frontend team

---

## 🚨 Critical Validations

### MUST Validate

| Field            | Rule                                                          | Example Error                   |
| ---------------- | ------------------------------------------------------------- | ------------------------------- |
| `type`           | Must be: `assessment`, `lesson`, `puzzle-game`, `custom-game` | "Invalid lesson type"           |
| `name`           | 1-200 chars, not empty                                        | "Lesson name is required"       |
| `mainBranch`     | Pattern: `^[a-z0-9-_]+$`                                      | "Branch name must be lowercase" |
| `visibility`     | Must be: `public`, `private`                                  | "Invalid visibility value"      |
| `folderId`       | Must exist in DB, belong to org                               | "Folder not found"              |
| `authorId`       | From JWT token only                                           | (Extract from token)            |
| `organizationId` | From JWT token only                                           | (Extract from token)            |

### MUST Generate

| Field            | Logic                                         |
| ---------------- | --------------------------------------------- |
| `id`             | Unique ID with prefix (e.g., `lesson_abc123`) |
| `slug`           | From name: lowercase, replace spaces with `-` |
| `status`         | Default: `draft`                              |
| `createdAt`      | Current timestamp                             |
| `updatedAt`      | Current timestamp                             |
| `version.id`     | Unique version ID                             |
| `version.number` | Start at 1                                    |

---

## 🔴 Error Response Format

**Standard Format** (all errors):

```json
{
  "success": false,
  "message": "Human-readable error",
  "errorCode": "MACHINE_READABLE_CODE",
  "errors": [
    {
      "field": "fieldName",
      "message": "Field-specific error"
    }
  ]
}
```

**Example - Validation Error**:

```json
{
  "success": false,
  "message": "Validation failed",
  "errorCode": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "name",
      "message": "Lesson name is required"
    },
    {
      "field": "type",
      "message": "Type must be one of: assessment, lesson, puzzle-game, custom-game"
    }
  ]
}
```

---

## 💡 Implementation Tips

### 1. JWT Token Handling

```javascript
// Extract user info from token
const getUserFromToken = (token) => {
  const decoded = jwt.verify(token, SECRET);
  return {
    userId: decoded.sub,
    organizationId: decoded.organizationId,
    role: decoded.role,
  };
};

// NEVER trust authorId/organizationId from request body
// ALWAYS extract from JWT token
```

### 2. Slug Generation

```javascript
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/--+/g, "-"); // Replace multiple - with single -
};

// Handle duplicate slugs by appending number
const ensureUniqueSlug = async (slug, organizationId) => {
  let uniqueSlug = slug;
  let counter = 1;

  while (await slugExists(uniqueSlug, organizationId)) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
};
```

### 3. Transaction Handling

```javascript
// Use database transaction for lesson + version creation
const createLesson = async (data) => {
  const transaction = await db.beginTransaction();

  try {
    // 1. Insert lesson
    const lesson = await db.lessons.insert({
      id: generateId("lesson_"),
      ...data,
    });

    // 2. Insert initial version
    const version = await db.lesson_versions.insert({
      id: generateId("ver_"),
      lesson_id: lesson.id,
      version_number: 1,
      name: "Initial version",
      status: "draft",
      created_by: data.author_id,
    });

    await transaction.commit();

    return { ...lesson, version };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
```

### 4. Folder Validation

```javascript
const validateFolder = async (folderId, organizationId) => {
  // Empty folder ID = root folder (valid)
  if (!folderId || folderId === "") {
    return true;
  }

  // Check folder exists and belongs to org
  const folder = await db.folders.findOne({
    id: folderId,
    organization_id: organizationId,
  });

  if (!folder) {
    throw new NotFoundError("Folder not found or access denied");
  }

  return true;
};
```

---

## 🧪 Testing Scenarios

### Happy Path Tests

```bash
✅ Create assessment in root folder
✅ Create lesson in specific folder
✅ Create puzzle game with custom branch
✅ Create public custom game
```

### Error Tests

```bash
❌ Missing type → 400 INVALID_LESSON_TYPE
❌ Empty name → 400 INVALID_LESSON_NAME
❌ Invalid branch format → 400 INVALID_BRANCH_NAME
❌ Non-existent folder → 404 FOLDER_NOT_FOUND
❌ No auth token → 401 UNAUTHORIZED
❌ Student role → 403 INSUFFICIENT_PERMISSIONS
❌ Duplicate name → 409 DUPLICATE_LESSON_SLUG
```

### Edge Cases

```bash
🔍 Name with special characters
🔍 Very long name (200 chars)
🔍 Multiple folders with same name
🔍 Concurrent creation (race condition)
```

---

## 📞 Support & Questions

### Before Implementation

**Read**:

1. Quick Reference (5 min)
2. Flow Diagrams (10 min)
3. API Specification (15 min)

**Then ask** in #bravo-authoring Slack

### During Implementation

**Questions about**:

- Business logic → #bravo-product
- API design → #bravo-backend
- Frontend integration → #bravo-frontend
- Deployment → #bravo-devops

### After Implementation

**Notify**:

- Frontend team when APIs are ready
- QA team for integration testing
- DevOps for deployment

---

## 🎯 Success Criteria

### Definition of Done

- [ ] All 3 endpoints implemented
- [ ] Database migrations run successfully
- [ ] All validation rules enforced
- [ ] Error responses follow standard format
- [ ] Unit tests passing (80%+ coverage)
- [ ] Integration tests passing
- [ ] OpenAPI/Swagger updated
- [ ] Postman collection created
- [ ] Code reviewed and merged
- [ ] Deployed to staging
- [ ] Frontend team notified
- [ ] Integration testing passed

### How to Verify

1. **Manual Test**:

   ```bash
   # Use Postman to test all 3 endpoints
   # Verify success and error cases
   ```

2. **Integration Test**:

   ```bash
   # Frontend team tests with real UI
   # Verify end-to-end flow works
   ```

3. **Load Test** (optional):
   ```bash
   # Test 100 concurrent lesson creations
   # Verify no race conditions
   ```

---

## 📅 Timeline

| Day          | Tasks                      | Deliverable           |
| ------------ | -------------------------- | --------------------- |
| **Day 1 AM** | Database setup, migrations | Tables created        |
| **Day 1 PM** | Implement POST /lessons    | Endpoint working      |
| **Day 2 AM** | Implement GET endpoints    | All endpoints working |
| **Day 2 PM** | Error handling, validation | All errors handled    |
| **Day 3 AM** | Testing, bug fixes         | Tests passing         |
| **Day 3 PM** | Documentation, deployment  | APIs in staging       |

**Target Completion**: December 14, 2025

---

## 🔗 Quick Links

- [📄 Quick Reference](./lesson-creation-quick-reference.md) - Essential info
- [📋 API Specification](./lesson-creation-api-spec.md) - Complete docs
- [🎨 Flow Diagrams](./lesson-creation-flow-diagrams.md) - Visual guide
- [💻 Frontend Feature](./lesson-creation-feature.md) - UI details
- [📚 Documentation Hub](./README.md) - All docs

---

## ❓ FAQ

**Q: Can users create lessons without an organization?**  
A: No. organizationId is required and must be extracted from JWT token.

**Q: What happens if folder doesn't exist?**  
A: Return 404 FOLDER_NOT_FOUND error.

**Q: What if name is already used?**  
A: Generate unique slug by appending number (e.g., "quiz-1-2").

**Q: Should we validate branch name format?**  
A: Yes. Only lowercase letters, numbers, hyphens, and underscores.

**Q: Do we need to support nested folders?**  
A: Not in this phase. Just validate folderId exists.

**Q: What's the default visibility?**  
A: "private" if not specified.

**Q: Should we rate limit lesson creation?**  
A: Recommended: 50 lessons per user per hour.

---

<div align="center">
  <h3>Ready to Build! 🚀</h3>
  <p>Questions? Ask in <strong>#bravo-authoring</strong> Slack channel</p>
  <p>Good luck! The frontend team is excited to integrate! 🎉</p>
</div>
