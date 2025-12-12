# Lesson Creation API Specification

**Frontend Feature**: Multi-step Lesson Creation Dialog  
**Target Backend Team**: API Implementation Guide  
**Date**: December 7, 2025  
**Status**: Ready for Backend Implementation

---

## Table of Contents

1. [Business Flow Overview](#business-flow-overview)
2. [User Journey](#user-journey)
3. [API Endpoints Required](#api-endpoints-required)
4. [Data Models & Schemas](#data-models--schemas)
5. [Request/Response Examples](#requestresponse-examples)
6. [Validation Rules](#validation-rules)
7. [Error Handling](#error-handling)
8. [Integration Points](#integration-points)
9. [Future Considerations](#future-considerations)

---

## Business Flow Overview

### High-Level Flow

```
Teacher (Authoring Page)
  → Click "Create new lesson" button
  → Modal Step 1: Select Content Type (assessment/lesson/puzzle-game/custom-game)
  → Modal Step 2: Configure (name, branch, visibility, folder)
  → Submit to Backend API
  → Receive Lesson/Content ID
  → Navigate to Compose Page with Lesson ID
```

### Business Context

- **Who**: Teachers/Content Creators with authoring permissions
- **Where**: `/authoring` page in the application
- **What**: Create new educational content (lessons, assessments, games)
- **Why**: Initiate content creation workflow before entering the compose/editing environment

---

## User Journey

### Step 1: Type Selection

**Frontend State**:

```typescript
{
  type: "assessment" | "lesson" | "puzzle-game" | "custom-game" | null;
}
```

**User Actions**:

- Clicks one of 4 colored cards representing content types
- Cannot proceed without selecting a type

**Type Definitions**:
| ID | Display Name | Description | Primary Use Case |
|---|---|---|---|
| `assessment` | Assessment | Tests, quizzes, evaluations | Measure student understanding |
| `lesson` | Lesson | Structured learning content | Text, media, interactive elements |
| `puzzle-game` | Puzzle Game | Interactive puzzles | Problem-solving activities |
| `custom-game` | Custom Template Game | Custom game templates | User-defined rules and mechanics |

### Step 2: Configuration

**Frontend State**:

```typescript
{
  type: "assessment",        // Selected from step 1
  name: "Quiz 1 - Algebra",  // User input (required)
  mainBranch: "main",        // Default: "main" (user can change)
  visibility: "private",      // Default: "private" (public/private)
  folderId: "fld_abc123"     // Optional: empty string "" = root folder
}
```

**User Actions**:

- Enters content name (required field)
- Optionally changes main branch name
- Selects visibility (private vs public)
- Selects destination folder
- Cannot submit without valid name

### Step 3: Submission

**Frontend Behavior**:

1. Validates form data (type selected, name not empty)
2. Makes API request to create lesson
3. Receives response with lesson/content ID
4. Navigates to `/authoring/compose/{lessonId}` (compose route)
5. Closes modal and resets form

---

## API Endpoints Required

### 1. Create Lesson/Content ⭐ **PRIMARY ENDPOINT**

```http
POST /service/v1/lessons
```

**Authentication**: Required (Bearer Token)  
**Authorization**: User must have `content.create` permission or teacher role

#### Request Headers

```http
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

#### Request Body

```typescript
{
  // Content type (REQUIRED)
  type: "assessment" | "lesson" | "puzzle-game" | "custom-game",

  // Content name (REQUIRED)
  name: string,  // 1-200 characters

  // Version control (OPTIONAL)
  mainBranch: string,  // Default: "main", Pattern: ^[a-z0-9-_]+$

  // Access control (REQUIRED)
  visibility: "public" | "private",

  // Organization (OPTIONAL)
  folderId: string,  // UUID or empty string for root, Default: ""

  // Metadata (AUTO-POPULATED by Frontend)
  authorId?: string,  // Extracted from JWT token (backend should override)
  organizationId?: string  // Extracted from JWT token (backend should override)
}
```

#### Success Response (201 Created)

```json
{
  "success": true,
  "message": "Lesson created successfully",
  "data": {
    "id": "lesson_a1b2c3d4",
    "type": "assessment",
    "name": "Quiz 1 - Algebra",
    "slug": "quiz-1-algebra",
    "mainBranch": "main",
    "visibility": "private",
    "folderId": "fld_abc123",
    "authorId": "user_xyz789",
    "organizationId": "org_def456",
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

#### Error Responses

See [Error Handling](#error-handling) section below.

---

### 2. List Folders (Pre-requisite for Step 2)

```http
GET /service/v1/folders
```

**Purpose**: Populate folder dropdown in configuration step

#### Query Parameters

```typescript
{
  organizationId?: string,  // Filter by organization (optional, can be inferred from token)
  parentId?: string,        // Get subfolders (optional, omit for root folders)
  limit?: number,           // Pagination limit (default: 50)
  page?: number             // Page number (default: 1)
}
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Folders retrieved successfully",
  "data": {
    "items": [
      {
        "id": "fld_abc123",
        "name": "Grade 10 - Mathematics",
        "parentId": null,
        "organizationId": "org_def456",
        "createdAt": "2025-11-01T09:00:00Z"
      },
      {
        "id": "fld_xyz789",
        "name": "Physics - Semester 1",
        "parentId": null,
        "organizationId": "org_def456",
        "createdAt": "2025-11-15T14:20:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "totalItems": 2,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

---

### 3. Get Lesson Details (For Navigation)

```http
GET /service/v1/lessons/{lessonId}
```

**Purpose**: Fetch lesson data when navigating to compose page

#### Path Parameters

- `lessonId`: UUID of the lesson (e.g., `lesson_a1b2c3d4`)

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Lesson retrieved successfully",
  "data": {
    "id": "lesson_a1b2c3d4",
    "type": "assessment",
    "name": "Quiz 1 - Algebra",
    "slug": "quiz-1-algebra",
    "mainBranch": "main",
    "visibility": "private",
    "folderId": "fld_abc123",
    "authorId": "user_xyz789",
    "organizationId": "org_def456",
    "status": "draft",
    "createdAt": "2025-12-07T10:30:00Z",
    "updatedAt": "2025-12-07T10:30:00Z",
    "versions": [
      {
        "id": "ver_1a2b3c",
        "number": 1,
        "name": "Initial version",
        "status": "draft",
        "createdAt": "2025-12-07T10:30:00Z"
      }
    ],
    "currentVersionId": "ver_1a2b3c",
    "folder": {
      "id": "fld_abc123",
      "name": "Grade 10 - Mathematics"
    }
  }
}
```

---

## Data Models & Schemas

### Frontend Form Data Structure

```typescript
// src/domains/authoring/types/lesson-creation.ts

export type LessonType =
  | "assessment"
  | "lesson"
  | "puzzle-game"
  | "custom-game";

export type CreateLessonFormData = {
  type: LessonType | null;
  name: string;
  mainBranch: string;
  visibility: "public" | "private";
  folderId: string;
};

// Default values when dialog opens
export const DEFAULT_FORM_DATA: CreateLessonFormData = {
  type: null,
  name: "",
  mainBranch: "main",
  visibility: "private",
  folderId: "", // Empty string = root folder
};
```

### Backend Database Schema (Suggested)

```sql
-- Lessons/Content table
CREATE TABLE lessons (
  id VARCHAR(255) PRIMARY KEY,
  type ENUM('assessment', 'lesson', 'puzzle-game', 'custom-game') NOT NULL,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  main_branch VARCHAR(100) NOT NULL DEFAULT 'main',
  visibility ENUM('public', 'private') NOT NULL DEFAULT 'private',
  folder_id VARCHAR(255) NULL REFERENCES folders(id) ON DELETE SET NULL,
  author_id VARCHAR(255) NOT NULL REFERENCES users(id),
  organization_id VARCHAR(255) NOT NULL REFERENCES organizations(id),
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,

  INDEX idx_author_id (author_id),
  INDEX idx_organization_id (organization_id),
  INDEX idx_folder_id (folder_id),
  INDEX idx_type (type),
  INDEX idx_status (status)
);

-- Folders table
CREATE TABLE folders (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  parent_id VARCHAR(255) NULL REFERENCES folders(id) ON DELETE CASCADE,
  organization_id VARCHAR(255) NOT NULL REFERENCES organizations(id),
  created_by VARCHAR(255) NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_organization_id (organization_id),
  INDEX idx_parent_id (parent_id)
);

-- Versions table (for version control)
CREATE TABLE lesson_versions (
  id VARCHAR(255) PRIMARY KEY,
  lesson_id VARCHAR(255) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  name VARCHAR(200) NOT NULL,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
  created_by VARCHAR(255) NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP NULL,
  change_summary TEXT NULL,

  INDEX idx_lesson_id (lesson_id),
  UNIQUE KEY unique_lesson_version (lesson_id, version_number)
);
```

---

## Request/Response Examples

### Example 1: Create Assessment

**Frontend sends**:

```json
POST /service/v1/lessons
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "type": "assessment",
  "name": "Midterm Exam - Algebra",
  "mainBranch": "main",
  "visibility": "private",
  "folderId": "fld_math_grade10"
}
```

**Backend responds**:

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
    "folderId": "fld_math_grade10",
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

**Frontend then navigates to**:

```
/authoring/compose/lesson_9x8y7z6
```

---

### Example 2: Create Public Puzzle Game in Root Folder

**Frontend sends**:

```json
POST /service/v1/lessons

{
  "type": "puzzle-game",
  "name": "Logic Challenge: Pattern Recognition",
  "mainBranch": "main",
  "visibility": "public",
  "folderId": ""
}
```

**Backend responds**:

```json
{
  "success": true,
  "message": "Puzzle game created successfully",
  "data": {
    "id": "lesson_p1u2z3l4",
    "type": "puzzle-game",
    "name": "Logic Challenge: Pattern Recognition",
    "slug": "logic-challenge-pattern-recognition",
    "mainBranch": "main",
    "visibility": "public",
    "folderId": null, // Root folder
    "authorId": "user_teacher123",
    "organizationId": "org_school456",
    "status": "draft",
    "createdAt": "2025-12-07T15:10:45Z",
    "updatedAt": "2025-12-07T15:10:45Z",
    "version": {
      "id": "ver_puz_001",
      "number": 1,
      "name": "Initial version",
      "status": "draft"
    }
  }
}
```

---

### Example 3: Create Lesson with Custom Branch

**Frontend sends**:

```json
POST /service/v1/lessons

{
  "type": "lesson",
  "name": "Introduction to Physics",
  "mainBranch": "physics-101-main",
  "visibility": "private",
  "folderId": "fld_physics_intro"
}
```

**Backend responds**:

```json
{
  "success": true,
  "message": "Lesson created successfully",
  "data": {
    "id": "lesson_phy001",
    "type": "lesson",
    "name": "Introduction to Physics",
    "slug": "introduction-to-physics",
    "mainBranch": "physics-101-main",
    "visibility": "private",
    "folderId": "fld_physics_intro",
    "authorId": "user_teacher123",
    "organizationId": "org_school456",
    "status": "draft",
    "createdAt": "2025-12-07T16:05:20Z",
    "updatedAt": "2025-12-07T16:05:20Z",
    "version": {
      "id": "ver_phy_001",
      "number": 1,
      "name": "Initial version",
      "status": "draft"
    }
  }
}
```

---

## Validation Rules

### Backend MUST Validate

#### 1. Type Field

```typescript
type: "assessment" | "lesson" | "puzzle-game" | "custom-game";
```

- **Required**: Yes
- **Allowed Values**: Only the 4 specified values
- **Error if**: Missing, empty, or invalid value
- **Error Code**: `INVALID_LESSON_TYPE`

#### 2. Name Field

```typescript
name: string;
```

- **Required**: Yes
- **Min Length**: 1 character
- **Max Length**: 200 characters
- **Pattern**: Allow alphanumeric, spaces, hyphens, and common punctuation
- **Trimming**: Backend should trim whitespace
- **Error if**: Empty string, exceeds max length, only whitespace
- **Error Code**: `INVALID_LESSON_NAME`

#### 3. Main Branch Field

```typescript
mainBranch: string;
```

- **Required**: No (default to "main")
- **Min Length**: 1 character
- **Max Length**: 100 characters
- **Pattern**: `^[a-z0-9-_]+$` (lowercase letters, numbers, hyphens, underscores only)
- **Default**: "main"
- **Error if**: Contains spaces, uppercase, special characters (except - and \_)
- **Error Code**: `INVALID_BRANCH_NAME`

#### 4. Visibility Field

```typescript
visibility: "public" | "private";
```

- **Required**: Yes
- **Allowed Values**: "public" or "private"
- **Default**: "private" (if missing)
- **Error if**: Invalid value
- **Error Code**: `INVALID_VISIBILITY`

#### 5. Folder ID Field

```typescript
folderId: string;
```

- **Required**: No
- **Format**: UUID or empty string
- **Empty String Meaning**: Root folder (no parent)
- **Validation**:
  - If provided and not empty, folder must exist in database
  - Folder must belong to user's organization
  - User must have access to folder
- **Error if**: Invalid UUID format, folder doesn't exist, user lacks access
- **Error Code**: `FOLDER_NOT_FOUND` or `FOLDER_ACCESS_DENIED`

#### 6. Authorization Validation

```typescript
authorId: string (from JWT token)
organizationId: string (from JWT token)
```

- **Extract from JWT**: Backend must extract user ID and organization ID from token
- **Override Frontend Values**: Do not trust `authorId` or `organizationId` from request body
- **Permissions Check**:
  - User must have `content.create` permission OR
  - User must have role: `teacher`, `admin`, or `content_creator`
- **Error if**: User lacks permissions
- **Error Code**: `INSUFFICIENT_PERMISSIONS`

---

## Error Handling

### Standard Error Response Format

```typescript
{
  success: false,
  message: string,          // Human-readable error message
  errorCode: string,        // Machine-readable error code
  errors?: Array<{          // Field-specific validation errors
    field: string,
    message: string
  }>
}
```

### Error Scenarios

#### 1. Missing Required Fields (400 Bad Request)

```json
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

#### 2. Invalid Lesson Type (400 Bad Request)

```json
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

#### 3. Name Too Long (400 Bad Request)

```json
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

#### 4. Invalid Branch Name Format (400 Bad Request)

```json
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

#### 5. Folder Not Found (404 Not Found)

```json
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

#### 6. Unauthorized (401 Unauthorized)

```json
{
  "success": false,
  "message": "Authentication required",
  "errorCode": "UNAUTHORIZED"
}
```

#### 7. Insufficient Permissions (403 Forbidden)

```json
{
  "success": false,
  "message": "You don't have permission to create content",
  "errorCode": "INSUFFICIENT_PERMISSIONS"
}
```

#### 8. Duplicate Slug (409 Conflict)

```json
{
  "success": false,
  "message": "A lesson with this name already exists",
  "errorCode": "DUPLICATE_LESSON_SLUG",
  "errors": [
    {
      "field": "name",
      "message": "Please choose a different name"
    }
  ]
}
```

#### 9. Organization Not Found (400 Bad Request)

```json
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

#### 10. Rate Limit Exceeded (429 Too Many Requests)

```json
{
  "success": false,
  "message": "Too many requests",
  "errorCode": "RATE_LIMIT_EXCEEDED",
  "errors": [
    {
      "field": null,
      "message": "You have exceeded the limit for creating lessons. Please try again in 1 hour."
    }
  ]
}
```

#### 11. Server Error (500 Internal Server Error)

```json
{
  "success": false,
  "message": "An unexpected error occurred",
  "errorCode": "INTERNAL_SERVER_ERROR"
}
```

---

## Integration Points

### Frontend Implementation Location

```
src/domains/authoring/
  ├── components/
  │   ├── create-lesson-dialog/
  │   │   ├── index.tsx                    # Main dialog component
  │   │   ├── type-selection-step.tsx      # Step 1: Type selection UI
  │   │   └── configuration-step.tsx       # Step 2: Configuration form
  │   └── my-lesson/
  │       └── index.tsx                     # Integration point with button
  ├── types/
  │   └── lesson-creation.ts                # Type definitions
  └── apis/
      └── index.ts                          # API calls (TO BE IMPLEMENTED)
```

### API Client Implementation (Frontend)

**File**: `src/domains/authoring/apis/index.ts`

```typescript
import { authInstance } from "@/shared/lib/axios";
import type { CreateLessonFormData } from "../types/lesson-creation";

/**
 * Create a new lesson/content
 */
export async function createLesson(payload: CreateLessonFormData) {
  // Remove null type value before sending
  if (!payload.type) {
    throw new Error("Lesson type is required");
  }

  const requestBody = {
    type: payload.type,
    name: payload.name.trim(),
    mainBranch: payload.mainBranch || "main",
    visibility: payload.visibility || "private",
    folderId: payload.folderId || undefined, // Convert empty string to undefined
  };

  const response = await authInstance.post("/service/v1/lessons", requestBody);
  return response.data;
}

/**
 * Fetch folders for organization
 */
export async function fetchFolders(organizationId?: string) {
  const response = await authInstance.get("/service/v1/folders", {
    params: {
      organizationId,
      limit: 100, // Get all folders for now
    },
  });
  return response.data;
}

/**
 * Fetch lesson details
 */
export async function fetchLesson(lessonId: string) {
  const response = await authInstance.get(`/service/v1/lessons/${lessonId}`);
  return response.data;
}
```

### React Query Hook (Frontend)

**File**: `src/domains/authoring/queries/index.tsx`

```typescript
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createLesson, fetchFolders, fetchLesson } from "../apis";
import type { CreateLessonFormData } from "../types/lesson-creation";

/**
 * Query key factory
 */
export const LESSON_QUERY_KEYS = {
  all: ["lessons"] as const,
  detail: (id: string) => ["lessons", id] as const,
  folders: (orgId?: string) => ["folders", orgId] as const,
};

/**
 * Mutation hook for creating lessons
 */
export function useCreateLessonMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLesson,
    onSuccess: () => {
      // Invalidate lessons list to refetch
      queryClient.invalidateQueries({ queryKey: LESSON_QUERY_KEYS.all });
    },
  });
}

/**
 * Query hook for fetching folders
 */
export function useFoldersQuery(organizationId?: string) {
  return useQuery({
    queryKey: LESSON_QUERY_KEYS.folders(organizationId),
    queryFn: () => fetchFolders(organizationId),
    enabled: !!organizationId,
  });
}

/**
 * Query hook for fetching lesson details
 */
export function useLessonQuery(lessonId: string) {
  return useQuery({
    queryKey: LESSON_QUERY_KEYS.detail(lessonId),
    queryFn: () => fetchLesson(lessonId),
    enabled: !!lessonId,
  });
}
```

### Updated Integration in MyLessons Component

**File**: `src/domains/authoring/components/my-lesson/index.tsx`

```typescript
import { Button } from "@/shared/components/ui/button";
import { DataTable } from "@/shared/components/ui/table";
import { CreateLessonDialog } from "../create-lesson-dialog";
import { useCreateLessonMutation, useFoldersQuery } from "../../queries";
import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { useNavigate } from "@tanstack/react-router";
import { useToast } from "@/shared/components/ui/use-toast";
import type { CreateLessonFormData } from "../../types/lesson-creation";

export default function MyLessons() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useCurrentUser();

  // Fetch folders for current organization
  const { data: foldersData } = useFoldersQuery(
    currentUser?.organizationId || undefined
  );

  const folders = foldersData?.data?.items || [];

  // Create lesson mutation
  const { mutate: createLesson, isPending } = useCreateLessonMutation();

  const handleLessonCreated = (formData: CreateLessonFormData) => {
    createLesson(formData, {
      onSuccess: (response) => {
        const lessonId = response.data.id;

        toast({
          title: "Success!",
          description: `${response.data.type} created successfully`,
        });

        // Navigate to compose page
        navigate({
          to: "/authoring/compose/$lessonId",
          params: { lessonId },
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to create lesson",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-2xl font-semibold">My Lessons</p>
        <CreateLessonDialog folders={folders} onCreated={handleLessonCreated}>
          <Button disabled={isPending}>
            {isPending ? "Creating..." : "Create new lesson"}
          </Button>
        </CreateLessonDialog>
      </div>
      <div className="mt-5">
        <DataTable columns={[]} data={[]} />
      </div>
    </div>
  );
}
```

---

## Future Considerations

### Phase 1: Current Scope ✅

- [x] Multi-step modal UI
- [x] Type selection (4 types)
- [x] Configuration form (name, branch, visibility, folder)
- [ ] API integration for lesson creation
- [ ] Folder loading from API
- [ ] Navigate to compose page

### Phase 2: Enhanced Features

- [ ] **Templates**: Pre-populate fields based on lesson templates
- [ ] **Duplicate Lesson**: Create from existing lesson
- [ ] **Bulk Import**: Import multiple lessons from CSV/JSON
- [ ] **Advanced Permissions**: Team-based folder access control
- [ ] **Tags**: Add tags/categories during creation
- [ ] **Preview Mode**: Preview lesson type examples before selection

### Phase 3: Collaboration

- [ ] **Co-authoring**: Invite collaborators during creation
- [ ] **Approval Workflow**: Submit for review before publishing
- [ ] **Comments**: Add creation notes/comments
- [ ] **Activity Log**: Track who created what and when

### Phase 4: Intelligence

- [ ] **AI Suggestions**: Suggest lesson names based on type
- [ ] **Smart Folders**: Auto-suggest folders based on content
- [ ] **Duplicate Detection**: Warn if similar lesson exists
- [ ] **Content Recommendations**: Suggest related existing content

---

## Backend Development Checklist

### Database

- [ ] Create `lessons` table with all fields
- [ ] Create `folders` table with hierarchy support
- [ ] Create `lesson_versions` table for version control
- [ ] Set up foreign keys and indexes
- [ ] Add database migrations

### API Endpoints

- [ ] Implement `POST /service/v1/lessons`
- [ ] Implement `GET /service/v1/folders`
- [ ] Implement `GET /service/v1/lessons/{id}`
- [ ] Add authentication middleware
- [ ] Add authorization checks

### Validation

- [ ] Validate lesson type enum
- [ ] Validate name length and format
- [ ] Validate branch name pattern
- [ ] Validate visibility enum
- [ ] Validate folder existence and access
- [ ] Validate user permissions

### Business Logic

- [ ] Generate unique slug from name
- [ ] Extract user/org from JWT token
- [ ] Create initial version record
- [ ] Handle root folder (empty folderId)
- [ ] Set default values (mainBranch, visibility)

### Error Handling

- [ ] Implement all error codes from spec
- [ ] Return consistent error format
- [ ] Add field-level validation errors
- [ ] Log errors for monitoring

### Testing

- [ ] Unit tests for validation logic
- [ ] Integration tests for API endpoints
- [ ] Test authentication/authorization
- [ ] Test error scenarios
- [ ] Test edge cases (empty folder, long names, etc.)

### Documentation

- [ ] Update OpenAPI/Swagger docs
- [ ] Add example requests/responses
- [ ] Document error codes
- [ ] Add migration guide

---

## Questions for Backend Team

1. **Slug Generation**: Should slugs be unique globally or per organization?
2. **Folder Hierarchy**: What's the max depth for folder nesting?
3. **Version Control**: Should we create initial version automatically or separately?
4. **Permissions**: What's the exact permission structure? (RBAC vs ABAC?)
5. **Rate Limiting**: What are the limits for lesson creation per user/hour?
6. **Soft Delete**: Should we use soft delete (deleted_at) for lessons?
7. **Audit Trail**: Do we need detailed audit logs for lesson creation?
8. **Webhooks**: Should we trigger webhooks on lesson creation?

---

## Contact

**Frontend Team**: [Your team contact]  
**Slack Channel**: #bravo-authoring  
**Jira Epic**: BRAVO-123  
**Frontend PR**: [Link to PR when ready]

**Questions?** Please review this spec and reach out in #bravo-authoring channel.
