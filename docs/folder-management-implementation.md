# Folder Management System Implementation

## Overview

The folder management system allows users to organize their lessons into hierarchical folders with custom names and colors. The system automatically initializes default folders for new users and supports full CRUD operations.

## Features

1. ✅ **Auto-Initialize Default Folders**: Automatically creates default folders (My Lessons, Drafts, Archived) when a user has none
2. ✅ **Create Custom Folders**: Users can create folders with custom names and colors
3. ✅ **Hierarchical Folder Tree**: Display folders in a tree structure with parent-child relationships
4. ✅ **Folder Operations**: Edit, delete, and move folders
5. ✅ **System Folders**: Protected folders that cannot be deleted or modified
6. ✅ **Color Customization**: 8 preset colors for folder organization
7. ✅ **Lesson Count**: Display number of lessons in each folder

## Architecture

### Backend (NestJS)

**Endpoints** (`/folders/*`):

- `GET /folders/tree` - Get hierarchical folder structure
- `POST /folders/initialize` - Initialize default folders for user
- `POST /folders` - Create new folder
- `PATCH /folders/:id` - Update folder (name, color, icon)
- `PATCH /folders/:id/move` - Move folder to different parent
- `DELETE /folders/:id` - Delete empty folder

**Service Methods** (`FolderService`):

- `getFolderTree(userId, organizationId)` - Returns nested folder structure
- `initializeDefaultFolders(userId, organizationId)` - Creates 3 default folders
- `createFolder(dto, userId, organizationId)` - Creates new folder with validation
- `updateFolder(id, dto, userId, organizationId)` - Updates folder properties
- `moveFolder(id, newParentId, userId, organizationId)` - Moves folder to new parent
- `deleteFolder(id, userId, organizationId)` - Deletes empty folder

**Folder Model**:

```prisma
model Folder {
  id             String   @id @default(uuid())
  name           String
  color          String?  // Hex color code
  icon           String?  // Icon identifier
  parentId       String?  // Parent folder ID
  isSystem       Boolean  @default(false)
  userId         String
  organizationId String
  lessonCount    Int      @default(0) // Virtual field
  children       Folder[] // Nested children
  createdAt      DateTime
  updatedAt      DateTime
}
```

### Frontend (React + TypeScript)

**File Structure**:

```
src/domains/folder/
├── apis/
│   └── index.ts              # API client functions
├── queries/
│   └── index.ts              # React Query hooks
├── hooks/
│   └── use-initialize-folders.ts  # Auto-initialization hook
├── components/
│   ├── folder-tree/
│   │   └── index.tsx         # Hierarchical tree display
│   ├── create-folder-dialog/
│   │   └── index.tsx         # Create/edit folder modal
│   └── folder-management-example/
│       └── index.tsx         # Complete usage example
└── index.ts                  # Barrel exports
```

## Usage Guide

### 1. Basic Integration

Add folder management to any page:

```tsx
import { FolderManagementExample } from "@/domains/folder/components/folder-management-example";

export function MyAuthoringPage() {
  return (
    <div className="flex">
      <aside className="w-64 border-r">
        <FolderManagementExample />
      </aside>
      <main className="flex-1">{/* Your content */}</main>
    </div>
  );
}
```

### 2. Custom Implementation

For more control, use the individual components:

```tsx
import { useState } from "react";
import {
  FolderTree,
  CreateFolderDialog,
  useInitializeFolders,
  useFolderTree,
  type FolderTreeNode,
} from "@/domains/folder";

export function MyFolderSidebar() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<FolderTreeNode | null>(
    null
  );

  // Auto-initialize default folders
  useInitializeFolders();

  // Fetch folder tree
  const { data: folderTree, isLoading } = useFolderTree();

  return (
    <div>
      <button onClick={() => setCreateDialogOpen(true)}>New Folder</button>

      {!isLoading && (
        <FolderTree
          folders={folderTree?.folders || []}
          selectedId={selectedFolder?.id}
          onSelect={(folder) => setSelectedFolder(folder)}
          onCreateSubfolder={(parentId) => {
            // Handle subfolder creation
          }}
          onEdit={(folder) => {
            // Handle folder edit
          }}
        />
      )}

      <CreateFolderDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
```

### 3. Using API Hooks

Direct access to folder operations:

```tsx
import {
  useFolderTree,
  useCreateFolder,
  useUpdateFolder,
  useDeleteFolder,
  useMoveFolder,
} from "@/domains/folder/queries";

function MyComponent() {
  // Query hooks
  const { data: folderTree, isLoading } = useFolderTree();

  // Mutation hooks
  const { mutate: createFolder } = useCreateFolder();
  const { mutate: updateFolder } = useUpdateFolder();
  const { mutate: deleteFolder } = useDeleteFolder();
  const { mutate: moveFolder } = useMoveFolder();

  const handleCreate = () => {
    createFolder({
      name: "New Folder",
      color: "#3B82F6",
      parentId: undefined,
    });
  };

  const handleUpdate = (id: string) => {
    updateFolder({ id, data: { name: "Updated Name" } });
  };

  const handleMove = (id: string, newParentId: string) => {
    moveFolder({ id, newParentId });
  };

  const handleDelete = (id: string) => {
    deleteFolder(id);
  };

  return <div>{/* Your UI */}</div>;
}
```

## Components API

### FolderTree

Displays hierarchical folder structure with expand/collapse and operations.

**Props**:

```typescript
interface FolderTreeProps {
  folders: FolderTreeNode[];
  onSelect?: (folder: FolderTreeNode) => void;
  onCreateSubfolder?: (parentId: string) => void;
  onEdit?: (folder: FolderTreeNode) => void;
  selectedId?: string | null;
}
```

**Features**:

- Recursive rendering of nested folders
- Expand/collapse with chevron icons
- Folder icons with custom colors
- Lesson count badges
- Context menu for operations (edit, delete, create subfolder)
- System folder protection (cannot edit/delete)

### CreateFolderDialog

Modal dialog for creating new folders with name and color customization.

**Props**:

```typescript
interface CreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentId?: string; // Optional parent for creating subfolders
}
```

**Features**:

- Name input with 100 character limit
- 8 preset colors (Blue, Green, Purple, Red, Orange, Pink, Indigo, Teal)
- Live preview of folder appearance
- Form validation
- Loading states
- Auto-close on success

### useInitializeFolders

Hook that automatically initializes default folders if user has none.

**Usage**:

```typescript
const { isLoading, hasInitialized } = useInitializeFolders();
```

**Behavior**:

- Checks if user has any folders
- If empty, calls `/folders/initialize` endpoint
- Creates 3 default folders: "My Lessons", "Drafts", "Archived"
- Shows success toast notification
- Auto-refreshes folder tree

## Data Types

### FolderTreeNode

```typescript
interface FolderTreeNode {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
  parentId: string | null;
  isSystem: boolean;
  lessonCount: number;
  children: FolderTreeNode[];
}
```

### CreateFolderDto

```typescript
interface CreateFolderDto {
  name: string;
  color?: string;
  icon?: string;
  parentId?: string;
}
```

### UpdateFolderDto

```typescript
interface UpdateFolderDto {
  name?: string;
  color?: string;
  icon?: string;
}
```

## Color Palette

The system provides 8 preset colors for folder customization:

| Color  | Hex Code | Usage                    |
| ------ | -------- | ------------------------ |
| Blue   | #3B82F6  | Default, general purpose |
| Green  | #10B981  | Completed/Published      |
| Purple | #8B5CF6  | Creative/Design          |
| Red    | #EF4444  | Important/Urgent         |
| Orange | #F97316  | In Progress              |
| Pink   | #EC4899  | Personal                 |
| Indigo | #6366F1  | Professional             |
| Teal   | #14B8A6  | Archive                  |

## Best Practices

### 1. Folder Initialization

Always use `useInitializeFolders` in the main layout/page where folders are displayed:

```tsx
function AuthoringLayout() {
  useInitializeFolders(); // Auto-creates default folders

  return <YourLayout />;
}
```

### 2. Folder Selection State

Store selected folder in state for lesson creation:

```tsx
const [selectedFolder, setSelectedFolder] = useState<FolderTreeNode | null>(
  null
);

// Use selectedFolder.id when creating lessons
const handleCreateLesson = () => {
  createLesson({
    title: "New Lesson",
    folderId: selectedFolder?.id,
  });
};
```

### 3. System Folder Protection

Always check `isSystem` before allowing modifications:

```tsx
const canModify = !folder.isSystem;

<DropdownMenuItem
  disabled={folder.isSystem}
  onClick={() => handleDelete(folder)}
>
  Delete
</DropdownMenuItem>;
```

### 4. Empty Folder Deletion

Backend only allows deleting empty folders. Show appropriate error messages:

```tsx
const { mutate: deleteFolder } = useDeleteFolder();

deleteFolder(folderId, {
  onError: (error) => {
    if (error.response?.status === 400) {
      toast.error("Cannot delete folder", {
        description: "Folder must be empty to delete",
      });
    }
  },
});
```

## API Response Examples

### GET /folders/tree

```json
{
  "folders": [
    {
      "id": "folder-1",
      "name": "My Lessons",
      "color": "#3B82F6",
      "icon": null,
      "parentId": null,
      "isSystem": true,
      "lessonCount": 5,
      "children": [
        {
          "id": "folder-4",
          "name": "Math",
          "color": "#10B981",
          "icon": null,
          "parentId": "folder-1",
          "isSystem": false,
          "lessonCount": 3,
          "children": []
        }
      ]
    },
    {
      "id": "folder-2",
      "name": "Drafts",
      "color": "#F97316",
      "icon": null,
      "parentId": null,
      "isSystem": true,
      "lessonCount": 2,
      "children": []
    }
  ]
}
```

### POST /folders

**Request**:

```json
{
  "name": "Science",
  "color": "#8B5CF6",
  "parentId": "folder-1"
}
```

**Response**:

```json
{
  "id": "folder-5",
  "name": "Science",
  "color": "#8B5CF6",
  "icon": null,
  "parentId": "folder-1",
  "isSystem": false,
  "createdAt": "2025-01-10T10:00:00Z",
  "updatedAt": "2025-01-10T10:00:00Z"
}
```

## Testing

### Unit Tests

Test folder operations:

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { useCreateFolder } from "@/domains/folder/queries";

test("creates folder successfully", async () => {
  const { result } = renderHook(() => useCreateFolder());

  result.current.mutate({
    name: "Test Folder",
    color: "#3B82F6",
  });

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });
});
```

### Integration Tests

Test folder tree display:

```typescript
import { render, screen } from "@testing-library/react";
import { FolderTree } from "@/domains/folder";

test("displays folder tree", () => {
  const folders = [
    { id: "1", name: "My Lessons", lessonCount: 5, children: [] },
  ];

  render(<FolderTree folders={folders} />);

  expect(screen.getByText("My Lessons")).toBeInTheDocument();
  expect(screen.getByText("5")).toBeInTheDocument();
});
```

## Troubleshooting

### Issue: Default folders not created

**Cause**: `useInitializeFolders` not called or API endpoint not responding

**Solution**:

1. Ensure `useInitializeFolders()` is called in the component
2. Check backend `/folders/initialize` endpoint is working
3. Verify user authentication is passing userId and organizationId

### Issue: Folder tree not updating after operations

**Cause**: React Query cache not invalidating

**Solution**: Mutation hooks automatically invalidate queries. If not working, manually invalidate:

```typescript
import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();
queryClient.invalidateQueries({ queryKey: [FOLDER_QUERY_KEY, "tree"] });
```

### Issue: Cannot delete folder

**Cause**: Folder contains lessons or subfolders

**Solution**: Backend validates that folder is empty. Move lessons to another folder before deleting.

## Future Enhancements

- [ ] Drag-and-drop folder reordering
- [ ] Folder sharing and permissions
- [ ] Folder templates
- [ ] Bulk folder operations
- [ ] Folder search and filtering
- [ ] Custom folder icons (beyond colors)
- [ ] Folder import/export
- [ ] Folder statistics dashboard

## Related Documentation

- [Backend Implementation Guide](./BACKEND_IMPLEMENTATION_GUIDE.md)
- [Lesson Creation Feature](./lesson-creation-feature.md)
- [Project Introduction](./PROJECT_INTRODUCTION.md)
