# Folder API Debugging Guide

## Issue: "No folders yet" showing in sidebar

Follow these steps to diagnose the issue:

## Step 1: Check Browser Console

Open the authoring page (`http://localhost:5174/authoring`) and open DevTools Console (F12).

You should see these debug logs:

```
Folder tree API response: { folders: [...] }
FolderSidebar - folderTreeData: { folders: [...] }
FolderSidebar - folders: [...]
FolderSidebar - isLoading: false
Folder tree data: { folders: [...] }
Is loading: false
```

### If you see errors:

- **401 Unauthorized**: Authentication issue - user not logged in
- **404 Not Found**: Backend endpoint not available
- **500 Server Error**: Backend error - check backend logs

## Step 2: Check Network Tab

In DevTools, go to Network tab:

1. Look for `GET /folders/tree` request
2. Check the response:
   - **Status 200**: Good, check response body
   - **Status 401**: Not authenticated
   - **Status 404**: Endpoint doesn't exist

### Expected Response:

```json
{
  "folders": [] // or array of folders if they exist
}
```

## Step 3: Test Backend Directly

Open a new terminal and test the backend:

```bash
# Get your auth token from localStorage in browser console
# localStorage.getItem('accessToken')

# Test the endpoint
curl -X GET http://localhost:8080/folders/tree \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

Expected response:

```json
{
  "folders": []
}
```

## Step 4: Initialize Folders Manually

If folders array is empty, trigger initialization:

```bash
curl -X POST http://localhost:8080/folders/initialize \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

Expected response:

```json
[
  {
    "id": "uuid-1",
    "name": "My Lessons",
    "color": "#3B82F6",
    ...
  },
  {
    "id": "uuid-2",
    "name": "Drafts",
    ...
  },
  {
    "id": "uuid-3",
    "name": "Archived",
    ...
  }
]
```

## Step 5: Check Backend Logs

In the backend terminal, look for:

```
GET /folders/tree
userId: test-user-id
organizationId: test-org-id
```

### Common Issues:

1. **Using test-user-id/test-org-id**: These are hardcoded fallbacks. You need real user credentials.

2. **Database has no folders**: The `useInitializeFolders` hook should auto-create them, but check if:

   - The POST request was made
   - The backend returned success
   - The folders were created in the database

3. **Auth guard is enabled**: If `@UseGuards(JwtAuthGuard)` is uncommented but you're not authenticated, requests will fail.

## Step 6: Verify Database

Connect to your database and check:

```sql
-- Check if folders exist
SELECT * FROM "Folder" WHERE "authorId" = 'test-user-id';

-- Check folder count
SELECT COUNT(*) FROM "Folder";

-- Check if any folders exist for any user
SELECT * FROM "Folder" LIMIT 10;
```

## Quick Fixes

### Fix 1: Remove Auth Guard (Temporarily)

In `folder.controller.ts`, ensure the auth guard is commented:

```typescript
@Controller('folders')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard) // <-- Should be commented for testing
export class FolderController {
```

### Fix 2: Force Initialize

Add this button temporarily to the sidebar:

```tsx
<Button
  onClick={async () => {
    try {
      await authInstance.post("/folders/initialize");
      await refetch();
      toast.success("Folders initialized!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to initialize");
    }
  }}
>
  Force Initialize Folders
</Button>
```

### Fix 3: Check Response Structure

The response should be:

```typescript
{ folders: FolderTreeNode[] }
```

NOT:

```typescript
{
  data: {
    body: {
      folders: [];
    }
  }
}
```

If it's the latter, update the API:

```typescript
// In folder/apis/index.ts
export const getFolderTree = async (): Promise<FolderTreeResponse> => {
  const response = await authInstance.get("/folders/tree");
  // If backend wraps in data.body, unwrap it:
  return response.data.body || response.data;
};
```

## What the Console Logs Tell You

### Log 1: "Folder tree API response"

Shows the raw response from the API.

- If `undefined`: API call failed
- If `{ folders: [] }`: API worked but no folders
- If `{ folders: [...] }`: Folders exist!

### Log 2: "FolderSidebar - folderTreeData"

Shows what React Query returned.

- Should match the API response
- If different, there's a query issue

### Log 3: "Folder tree data"

Shows what the initialization hook sees.

- If `{ folders: [] }` and isLoading is `false`: Hook should trigger initialization
- Check if initialization POST request appears in Network tab

### Log 4: "Is loading"

- `true`: Still fetching, wait
- `false`: Data loaded, should show folders or trigger init

## Still Not Working?

Share these details:

1. Console logs output
2. Network tab screenshot showing the GET request/response
3. Backend terminal logs
4. Database folder count

## Expected Flow

```
1. User opens /authoring
   ↓
2. FolderSidebar renders
   ↓
3. useInitializeFolders() called
   ↓
4. useFolderTree() fetches GET /folders/tree
   ↓
5a. If folders exist: Display them
5b. If folders = []: POST /folders/initialize
   ↓
6. Folders appear in sidebar
```

If stuck at any step, check that step's logs!
