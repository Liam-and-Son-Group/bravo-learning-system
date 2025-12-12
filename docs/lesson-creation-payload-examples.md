# Lesson Creation - API Payload Examples

**Quick reference for backend developers**: Real-world payload examples

---

## 📤 Request Payloads

### Example 1: Create Private Assessment

```json
POST /service/v1/lessons
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "type": "assessment",
  "name": "Midterm Exam - Algebra",
  "mainBranch": "main",
  "visibility": "private",
  "folderId": "fld_math_101"
}
```

### Example 2: Create Public Lesson in Root Folder

```json
POST /service/v1/lessons
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "type": "lesson",
  "name": "Introduction to Physics",
  "mainBranch": "main",
  "visibility": "public",
  "folderId": ""
}
```

### Example 3: Create Puzzle Game with Custom Branch

```json
POST /service/v1/lessons
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "type": "puzzle-game",
  "name": "Logic Challenge: Pattern Recognition",
  "mainBranch": "puzzle-v1",
  "visibility": "private",
  "folderId": "fld_games_collection"
}
```

### Example 4: Create Custom Game Template

```json
POST /service/v1/lessons
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "type": "custom-game",
  "name": "Math Race: Multiplication Challenge",
  "mainBranch": "main",
  "visibility": "public",
  "folderId": ""
}
```

---

## 📥 Success Responses

### Example 1: Assessment Created (201 Created)

```json
HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "message": "Assessment created successfully",
  "data": {
    "id": "lesson_9x8y7z6",
    "type": "assessment",
    "name": "Midterm Exam - Algebra",
    "slug": "midterm-exam-algebra",
    "mainBranch": "main",
    "visibility": "private",
    "folderId": "fld_math_101",
    "authorId": "user_teacher123",
    "organizationId": "org_school456",
    "status": "draft",
    "createdAt": "2025-12-07T14:22:30Z",
    "updatedAt": "2025-12-07T14:22:30Z",
    "version": {
      "id": "ver_initial_001",
      "number": 1,
      "name": "Initial version",
      "status": "draft"
    }
  }
}
```

### Example 2: Lesson Created (201 Created)

```json
HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "message": "Lesson created successfully",
  "data": {
    "id": "lesson_abc123",
    "type": "lesson",
    "name": "Introduction to Physics",
    "slug": "introduction-to-physics",
    "mainBranch": "main",
    "visibility": "public",
    "folderId": null,
    "authorId": "user_prof456",
    "organizationId": "org_university789",
    "status": "draft",
    "createdAt": "2025-12-07T15:10:45Z",
    "updatedAt": "2025-12-07T15:10:45Z",
    "version": {
      "id": "ver_phys_001",
      "number": 1,
      "name": "Initial version",
      "status": "draft"
    }
  }
}
```

---

## ❌ Error Responses

### 1. Missing Required Field (400 Bad Request)

```json
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "success": false,
  "message": "Validation failed",
  "errorCode": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "type",
      "message": "Lesson type is required"
    },
    {
      "field": "name",
      "message": "Lesson name is required"
    }
  ]
}
```

### 2. Invalid Lesson Type (400 Bad Request)

```json
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "success": false,
  "message": "Invalid lesson type",
  "errorCode": "INVALID_LESSON_TYPE",
  "errors": [
    {
      "field": "type",
      "message": "Type must be one of: assessment, lesson, puzzle-game, custom-game"
    }
  ]
}
```

**Request that caused it**:

```json
{
  "type": "quiz", // ❌ Invalid - not in enum
  "name": "Test"
}
```

### 3. Name Too Long (400 Bad Request)

```json
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "success": false,
  "message": "Validation failed",
  "errorCode": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "name",
      "message": "Lesson name must not exceed 200 characters"
    }
  ]
}
```

### 4. Invalid Branch Name (400 Bad Request)

```json
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "success": false,
  "message": "Invalid branch name format",
  "errorCode": "INVALID_BRANCH_NAME",
  "errors": [
    {
      "field": "mainBranch",
      "message": "Branch name must contain only lowercase letters, numbers, hyphens, and underscores"
    }
  ]
}
```

**Request that caused it**:

```json
{
  "type": "lesson",
  "name": "Test",
  "mainBranch": "Main Branch" // ❌ Invalid - has uppercase and space
}
```

### 5. Folder Not Found (404 Not Found)

```json
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "success": false,
  "message": "Folder not found",
  "errorCode": "FOLDER_NOT_FOUND",
  "errors": [
    {
      "field": "folderId",
      "message": "The specified folder does not exist or you don't have access to it"
    }
  ]
}
```

**Request that caused it**:

```json
{
  "type": "lesson",
  "name": "Test",
  "folderId": "fld_nonexistent" // ❌ Folder doesn't exist
}
```

### 6. Unauthorized (401 Unauthorized)

```json
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "success": false,
  "message": "Authentication required",
  "errorCode": "UNAUTHORIZED"
}
```

**Request that caused it**:

```http
POST /service/v1/lessons
Content-Type: application/json
// ❌ Missing Authorization header

{
  "type": "lesson",
  "name": "Test"
}
```

### 7. Insufficient Permissions (403 Forbidden)

```json
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "success": false,
  "message": "You don't have permission to create content",
  "errorCode": "INSUFFICIENT_PERMISSIONS"
}
```

**Scenario**: User is a student, not a teacher

### 8. Duplicate Slug (409 Conflict)

```json
HTTP/1.1 409 Conflict
Content-Type: application/json

{
  "success": false,
  "message": "A lesson with this name already exists",
  "errorCode": "DUPLICATE_LESSON_SLUG",
  "errors": [
    {
      "field": "name",
      "message": "Please choose a different name or the system will append a number"
    }
  ]
}
```

**Note**: Backend should auto-append number (e.g., "quiz-1" → "quiz-1-2")

### 9. Organization Not Found (400 Bad Request)

```json
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "success": false,
  "message": "Organization not found",
  "errorCode": "ORGANIZATION_NOT_FOUND",
  "errors": [
    {
      "field": "organizationId",
      "message": "Your account is not associated with any organization"
    }
  ]
}
```

### 10. Internal Server Error (500)

```json
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "success": false,
  "message": "An unexpected error occurred",
  "errorCode": "INTERNAL_SERVER_ERROR"
}
```

---

## 🔧 Edge Cases

### Case 1: Empty String Folder ID (Valid - Root Folder)

```json
{
  "type": "lesson",
  "name": "Test",
  "folderId": "" // ✅ Valid - means root folder
}
```

**Backend should**:

- Treat empty string as null/root folder
- Store as NULL in database
- Return null in response

### Case 2: Whitespace in Name (Should Trim)

```json
{
  "type": "lesson",
  "name": "  Quiz 1  ", // ❌ Has leading/trailing spaces
  "visibility": "private"
}
```

**Backend should**:

- Trim whitespace: "Quiz 1"
- Generate slug: "quiz-1"
- Return trimmed name in response

### Case 3: Special Characters in Name

```json
{
  "type": "lesson",
  "name": "Quiz #1: Math & Science (Part 2)",
  "visibility": "private"
}
```

**Backend should**:

- Accept the name as-is
- Generate clean slug: "quiz-1-math-science-part-2"
- Return original name in response

### Case 4: Missing Optional Fields

```json
{
  "type": "lesson",
  "name": "Test"
  // Missing: mainBranch, visibility, folderId
}
```

**Backend should**:

- Use defaults:
  - mainBranch: "main"
  - visibility: "private"
  - folderId: null (root)

---

## 📊 Field Value Reference

### Type Enum Values

```typescript
"assessment"; // ✅ Valid
"lesson"; // ✅ Valid
"puzzle-game"; // ✅ Valid
"custom-game"; // ✅ Valid
"quiz"; // ❌ Invalid
"test"; // ❌ Invalid
"game"; // ❌ Invalid
```

### Visibility Enum Values

```typescript
"private"; // ✅ Valid - Default
"public"; // ✅ Valid
"internal"; // ❌ Invalid
"restricted"; // ❌ Invalid
```

### Branch Name Patterns

```typescript
"main"; // ✅ Valid
"develop"; // ✅ Valid
"feature-123"; // ✅ Valid
"lesson_v1"; // ✅ Valid
"v1-0-0"; // ✅ Valid

"Main"; // ❌ Invalid - uppercase
"feature 123"; // ❌ Invalid - space
"lesson/v1"; // ❌ Invalid - slash
"feature@123"; // ❌ Invalid - special char
```

### Status Values (Auto-set)

```typescript
"draft"; // ✅ Initial status
"published"; // Later via publish endpoint
"archived"; // Later via archive endpoint
```

---

## 🧩 Complete Request/Response Flow

### Frontend Submits:

```json
{
  "type": "assessment",
  "name": "  Final Exam  ",
  "mainBranch": "main",
  "visibility": "private",
  "folderId": "fld_abc123"
}
```

### Backend Processes:

1. **Extract from JWT**:

   - authorId: "user_teacher456"
   - organizationId: "org_school789"

2. **Validate**:

   - type: ✅ "assessment" is valid enum
   - name: ✅ Not empty (after trim)
   - mainBranch: ✅ "main" matches pattern
   - visibility: ✅ "private" is valid enum
   - folderId: ✅ Exists and belongs to org

3. **Transform**:

   - name: "Final Exam" (trimmed)
   - slug: "final-exam" (generated)

4. **Create**:
   - Insert into lessons table
   - Insert into lesson_versions table
   - Generate IDs

### Backend Returns:

```json
{
  "success": true,
  "message": "Assessment created successfully",
  "data": {
    "id": "lesson_xyz789",
    "type": "assessment",
    "name": "Final Exam",
    "slug": "final-exam",
    "mainBranch": "main",
    "visibility": "private",
    "folderId": "fld_abc123",
    "authorId": "user_teacher456",
    "organizationId": "org_school789",
    "status": "draft",
    "createdAt": "2025-12-07T16:30:00Z",
    "updatedAt": "2025-12-07T16:30:00Z",
    "version": {
      "id": "ver_001",
      "number": 1,
      "name": "Initial version",
      "status": "draft"
    }
  }
}
```

### Frontend Uses Response:

```typescript
const response = await api.post("/lessons", formData);
const lessonId = response.data.id; // "lesson_xyz789"

// Navigate to compose page
navigate(`/authoring/compose/${lessonId}`);
```

---

## 📋 Postman Collection

### Collection Structure

```
Bravo Learning - Lesson Creation
│
├── Create Lesson
│   ├── 1. Create Assessment (Success)
│   ├── 2. Create Lesson (Success)
│   ├── 3. Create Puzzle Game (Success)
│   ├── 4. Create Custom Game (Success)
│   ├── 5. Missing Type (Error 400)
│   ├── 6. Empty Name (Error 400)
│   ├── 7. Invalid Branch (Error 400)
│   ├── 8. Folder Not Found (Error 404)
│   └── 9. No Auth Token (Error 401)
│
├── Get Folders
│   └── List All Folders
│
└── Get Lesson
    └── Get Lesson Details
```

### Environment Variables

```json
{
  "baseUrl": "http://localhost:3000/service/v1",
  "authToken": "{{JWT_TOKEN}}",
  "organizationId": "org_test123",
  "folderId": "fld_test456"
}
```

---

## 🎯 Backend Testing Checklist

### Happy Path Tests

- [ ] Create assessment with all fields
- [ ] Create lesson with minimal fields
- [ ] Create puzzle game in root folder
- [ ] Create custom game with custom branch
- [ ] Create public lesson
- [ ] Create private assessment

### Validation Tests

- [ ] Missing type field
- [ ] Invalid type value
- [ ] Empty name
- [ ] Name too long (>200 chars)
- [ ] Invalid branch format (uppercase)
- [ ] Invalid branch format (spaces)
- [ ] Invalid visibility value
- [ ] Invalid folder ID format

### Authorization Tests

- [ ] No auth token
- [ ] Invalid auth token
- [ ] Expired auth token
- [ ] Student role (no permission)
- [ ] Teacher role (has permission)
- [ ] Admin role (has permission)

### Business Logic Tests

- [ ] Duplicate name (slug handling)
- [ ] Folder doesn't exist
- [ ] Folder belongs to different org
- [ ] Empty folderId (root folder)
- [ ] Missing optional fields (use defaults)
- [ ] Whitespace in name (trim)
- [ ] Special characters in name

### Database Tests

- [ ] Lesson record created
- [ ] Version record created
- [ ] Foreign keys correct
- [ ] Timestamps set
- [ ] Transaction rollback on error

---

<div align="center">
  <p><strong>Ready to Test!</strong></p>
  <p>Import these examples into Postman and start testing</p>
</div>
