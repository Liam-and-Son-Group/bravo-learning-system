# Classroom Feature Implementation Status

## Overview

This document tracks the implementation status of the Classroom (Learning Space) feature with search functionality.

## Backend Implementation ✅ Complete

### Learning Space Module

- **Location**: `bravo-learning-service/src/learning-space/`
- **Status**: Fully implemented and ready for use

### Endpoints Available

#### 1. Create Learning Space

- **Endpoint**: `POST /organizations/:organizationId/learning-spaces`
- **DTO**: `CreateLearningSpaceDto`
- **Fields**: `name` (required)
- **Auth**: Requires OrganizationRoleGuard (TEACHER, ADMIN roles)

#### 2. List Learning Spaces with Search

- **Endpoint**: `GET /organizations/:organizationId/learning-spaces`
- **Query Params**:
  - `page` (default: 1)
  - `pageSize` (default: 20, max: 100)
  - `search` - Filter by name (case-insensitive contains) ✅
  - `sortBy` - Options: 'createdAt', 'name' (default: 'createdAt')
  - `sortOrder` - Options: 'asc', 'desc' (default: 'desc')
- **Response**: Paginated with `data` and `meta` (total, page, pageSize, pageCount)

#### 3. Get Learning Space Detail

- **Endpoint**: `GET /organizations/:organizationId/learning-spaces/:id`
- **Query Params**:
  - `includeAssessments` - Include linked assessments
  - `includeQuizzes` - Include linked quizzes
  - `includeCounts` - Include counts of assessments, quizzes, enrolments
  - `includeEnrolments` - Include enrolment data with user info

#### 4. Update Learning Space

- **Endpoint**: `PATCH /organizations/:organizationId/learning-spaces/:id`
- **DTO**: `UpdateLearningSpaceDto`
- **Auth**: Requires OrganizationRoleGuard (TEACHER, ADMIN roles)

#### 5. Delete Learning Space

- **Endpoint**: `DELETE /organizations/:organizationId/learning-spaces/:id`
- **Auth**: Requires OrganizationRoleGuard (ADMIN roles only)

#### 6. Enrolment Management

- **Create**: `POST /organizations/:organizationId/learning-spaces/:id/enrolments`
- **List**: `GET /organizations/:organizationId/learning-spaces/:id/enrolments`
- **Remove**: `DELETE /organizations/:organizationId/learning-spaces/:id/enrolments/:userId`

#### 7. Assessment/Quiz Linking

- **Link Assessments**: `POST /organizations/:organizationId/learning-spaces/:id/assessments:link`
- **Unlink Assessments**: `POST /organizations/:organizationId/learning-spaces/:id/assessments:unlink`
- **Link Quizzes**: `POST /organizations/:organizationId/learning-spaces/:id/quizzes:link`
- **Unlink Quizzes**: `POST /organizations/:organizationId/learning-spaces/:id/quizzes:unlink`

### Search Implementation ✅

The backend implements search functionality in `learning-space.service.ts`:

```typescript
where: {
  organizationId,
  ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
}
```

- **Type**: Case-insensitive substring match
- **Field**: Learning space name
- **Performance**: Uses Prisma's query optimization

## Frontend Implementation 🟡 Partially Complete

### Completed ✅

#### 1. UI Components

- **ClassroomsPage**: Main page with search, scope toggle, loading states
- **CreateClassroomDialog**: Form with name, description, organization, enrollment key
- **ClassroomsTable**: Table view for "mine" and "organizations" scopes
- **SharedClassroomCard**: Card view for "shared" scope
- **Search UI**: Debounced search input (1000ms delay)
- **URL State Management**: Search query and scope stored in URL params

#### 2. API Integration

- **File**: `src/domains/classroom/apis/index.ts`
- **Updated Functions**:
  - ✅ `fetchClassrooms()` - Connected to real backend with search support
  - ✅ `fetchClassroom()` - Connected to backend with includes support
  - ✅ `fetchClassroomStudents()` - Connected to enrolments endpoint
  - ✅ `createClassroom()` - Connected to create endpoint
  - ✅ `leaveClassroom()` - Connected to unenrol endpoint

#### 3. Query Hooks

- **File**: `src/domains/classroom/queries/index.ts`
- **Updated**: All hooks now accept and use `organizationId` parameter
- **Hooks**:
  - `useClassroomsQuery(filters, organizationId)`
  - `useClassroomQuery(id, organizationId)`
  - `useClassroomStudentsQuery(id, organizationId)`
  - `useCreateClassroomMutation()`
  - `useLeaveClassroomMutation()`

#### 4. Data Transformation

- **Helper**: `transformLearningSpace()` converts backend response to frontend `Classroom` type
- **Handles**: Missing fields, default values, organization data nesting

### In Progress / TODO 🟡

#### 1. Update Classroom API

- **Status**: Not yet implemented
- **Issue**: Backend PATCH endpoint requires organizationId in URL
- **Solution**: Need to add organizationId parameter to `updateClassroom()` function and mutation hook
- **Current State**: Throws error with message "Update classroom not fully implemented"

#### 2. Toggle Status Feature

- **Status**: Frontend UI exists, backend not implemented
- **Issue**: Backend doesn't have a `status` field in LearningSpace model
- **Options**:
  a. Add `status` enum field to Prisma schema and create migration
  b. Remove toggle status UI from frontend
  c. Use a different field (e.g., `isActive` boolean)

#### 3. Scope Filtering

- **Status**: Frontend has "mine" / "organizations" / "shared" toggle
- **Issue**: Backend only filters by organizationId, no user-specific filtering
- **TODO**:
  - Backend: Add query parameter to filter by current user (creator/teacher)
  - Backend: Implement "shared" classrooms concept (cross-organization?)
  - Or: Implement filtering in frontend based on enrolments

#### 4. Backend Missing Fields

The backend `LearningSpace` model is missing some frontend-expected fields:

- `description` - Add to Prisma schema
- `enrollmentKey` - Add if needed for self-enrollment feature
- `status` - Add if toggle feature is needed

## Testing Checklist

### Backend Tests

- [ ] Create learning space
- [ ] List learning spaces with pagination
- [ ] Search learning spaces by name
- [ ] Get learning space with includes
- [ ] Update learning space name
- [ ] Delete learning space
- [ ] Enrol user
- [ ] List enrolments
- [ ] Unenrol user
- [ ] Authorization guards work correctly

### Frontend Tests

- [ ] List classrooms loads from real API
- [ ] Search filters classrooms by name
- [ ] Debounce prevents excessive API calls
- [ ] URL params sync with search state
- [ ] Create classroom succeeds
- [ ] Create classroom validation works
- [ ] Loading states display correctly
- [ ] Error states display correctly
- [ ] Organization data loads and displays
- [ ] Student count displays correctly

### Integration Tests

- [ ] Frontend search matches backend results
- [ ] Pagination works end-to-end
- [ ] Created classroom appears in list
- [ ] Deleted classroom removed from list
- [ ] Organization filter works correctly

## Next Steps

### Priority 1: Complete Core Features

1. Implement `updateClassroom()` with organizationId
2. Test create, list, search flow end-to-end
3. Fix any data transformation issues

### Priority 2: Backend Enhancements

1. Add `description` field to LearningSpace model
2. Add user-specific filtering (creator, teacher, student)
3. Implement "shared" classrooms concept

### Priority 3: UI/UX Polish

1. Add error handling and user feedback
2. Add empty states
3. Add loading skeletons
4. Improve search UX (clear button, search suggestions)

### Priority 4: Additional Features

1. Implement status toggle (if needed)
2. Add enrollment key generation and usage
3. Add bulk operations
4. Add export functionality

## API Usage Examples

### List Classrooms with Search

```typescript
GET /organizations/org_123/learning-spaces?search=math&page=1&pageSize=20&sortBy=name&sortOrder=asc
```

### Create Classroom

```typescript
POST /organizations/org_123/learning-spaces
{
  "name": "Advanced Mathematics"
}
```

### Get Classroom with Counts

```typescript
GET /organizations/org_123/learning-spaces/cls_456?includeCounts=true
```

### Enrol Student

```typescript
POST /organizations/org_123/learning-spaces/cls_456/enrolments
{
  "userId": "user_789",
  "role": "STUDENT"
}
```

## Notes

- **Organization ID**: Required for all classroom operations. Obtained from `useCurrentUser()` hook.
- **Search Performance**: Backend uses Prisma's optimized query with case-insensitive contains
- **Debounce**: Frontend uses 1000ms debounce to reduce API calls during typing
- **URL State**: Search query and scope are stored in URL for shareability and browser history
- **Authorization**: Backend uses role-based guards - ensure users have appropriate organization roles

## Related Documentation

- [Backend Implementation Guide](./BACKEND_IMPLEMENTATION_GUIDE.md)
- [Lesson Creation Feature](./lesson-creation-feature.md)
- [Project Introduction](./PROJECT_INTRODUCTION.md)
