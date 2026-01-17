# Content Editor Architecture

**Last Updated**: December 13, 2025  
**Purpose**: Documentation of Lexical editor integration and content authoring system

---

## Overview

The Bravo Learning System now includes a sophisticated content authoring system built on Lexical 0.39.0, featuring custom plugins for interactive educational content and a modular compose page architecture.

---

## Architecture Summary

### Core Components

```
Content Authoring System
├── Lexical Editor Core
│   └── LexicalEditorCore.tsx (Base editor setup)
├── Custom Content Plugins (4 types)
│   ├── Matching Plugin (Shuffle icon, blue theme)
│   ├── Fill in Blank Plugin (FileText icon, green theme)
│   ├── Multiple Choice Plugin (ListChecks icon, purple theme)
│   └── Drag & Drop Plugin (Move icon, orange theme)
├── Compose Page (Modular structure)
│   ├── ComposeHeader (Title, breadcrumb, actions)
│   ├── ComposeSidebar (Plugin selector)
│   ├── ComposeMainContent (Content blocks)
│   └── ContentBlockCard (Individual content block)
└── Shared UI Components
    └── IconHeaderCard (Reusable card with icon header)
```

---

## Lexical Editor Integration

### Installation

```bash
pnpm add lexical@0.39.0 @lexical/react@0.39.0
pnpm add @dnd-kit/core@6.3.1 @dnd-kit/sortable@10.0.0 @dnd-kit/utilities@3.2.2
```

**Note**: The `@dnd-kit` packages are used for drag-and-drop functionality in the Drag & Drop plugin and for reordering content blocks.

### Core Setup

**Location**: `src/domains/authoring/components/lexical-editor/core/LexicalEditorCore.tsx`

```typescript
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

const initialConfig = {
  namespace: "BravoEditor",
  theme: editorTheme,
  onError: (error: Error) => console.error(error),
};

export const LexicalEditorCore = ({ children }) => (
  <LexicalComposer initialConfig={initialConfig}>
    <RichTextPlugin
      contentEditable={<ContentEditable />}
      placeholder={<div>Start typing...</div>}
      ErrorBoundary={LexicalErrorBoundary}
    />
    {children}
  </LexicalComposer>
);
```

---

## Custom Content Plugins

### Plugin Architecture

Each plugin follows a consistent pattern:

1. **Editor Mode**: Editable form for content creation
2. **Preview Mode**: Read-only display of created content
3. **Color Theme**: Unique color scheme for visual distinction
4. **Icon**: Lucide React icon for plugin identification

### Plugin Types

#### 1. Matching Plugin

**Location**: `src/domains/authoring/components/lexical-editor/plugins/matching/MatchingPlugin.tsx`

**Purpose**: Create matching pair exercises

**Theme**: Blue (`bg-blue-100`, `text-blue-600`)

**Icon**: `Shuffle`

**Data Structure**:

```typescript
{
  id: string;
  type: "matching";
  title: string;
  instructions: string;
  pairs: Array<{
    id: string;
    left: string;
    right: string;
  }>;
}
```

**Features**:

- Dynamic pair addition/removal
- Drag handles for reordering
- Edit/Preview modes

---

#### 2. Fill in Blank Plugin

**Location**: `src/domains/authoring/components/lexical-editor/plugins/fill-in-blank/FillInBlankPlugin.tsx`

**Purpose**: Create fill-in-the-blank exercises

**Theme**: Green (`bg-green-100`, `text-green-600`)

**Icon**: `FileText`

**Data Structure**:

```typescript
{
  id: string;
  type: "fill-in-blank";
  title: string;
  instructions: string;
  passage: string;
  blanks: Array<{
    id: string;
    position: number;
    correctAnswer: string;
    alternatives: string[];
  }>;
}
```

**Features**:

- Rich text passage editing
- Inline blank markers
- Multiple correct answers support

---

#### 3. Multiple Choice Plugin

**Location**: `src/domains/authoring/components/lexical-editor/plugins/multiple-choice/MultipleChoicePlugin.tsx`

**Purpose**: Create single or multiple answer questions

**Theme**: Purple (`bg-purple-100`, `text-purple-600`)

**Icon**: `ListChecks`

**Data Structure**:

```typescript
{
  id: string;
  type: "multiple-choice";
  title: string;
  instructions: string;
  question: string;
  allowMultiple: boolean;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  feedback?: string;
}
```

**Features**:

- Single/multiple selection mode
- Dynamic option management
- Correct answer marking
- Optional feedback

---

#### 4. Drag & Drop Plugin

**Location**: `src/domains/authoring/components/lexical-editor/plugins/drag-drop/DragDropPlugin.tsx`

**Purpose**: Create categorization exercises

**Theme**: Orange (`bg-orange-100`, `text-orange-600`)

**Icon**: `Move`

**Data Structure**:

```typescript
{
  id: string;
  type: "drag-drop";
  title: string;
  instructions: string;
  categories: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  items: Array<{
    id: string;
    text: string;
    categoryId: string;
  }>;
  showFeedback: boolean;
}
```

**Features**:

- Multiple category management
- Color-coded categories
- Item assignment
- Optional feedback toggle

---

## IconHeaderCard Component

### Purpose

A reusable UI component that provides consistent header styling across all plugins and can be used throughout the application for any card with an icon header.

### Location

`src/shared/components/ui/icon-header-card.tsx`

### API

```typescript
interface IconHeaderCardProps {
  Icon: LucideIcon; // Icon component from lucide-react
  title: string; // Card heading
  description: string; // Subheading/description
  bgClass: string; // Background color (e.g., "bg-blue-100")
  iconClass: string; // Icon color (e.g., "text-blue-600")
  actions?: ReactNode; // Optional actions slot (buttons, etc.)
  children: ReactNode; // Main card content
}
```

### Usage Example

```typescript
import { IconHeaderCard } from "@/shared/components/ui/icon-header-card";
import { Shuffle } from "lucide-react";

<IconHeaderCard
  Icon={Shuffle}
  title="Matching Exercise"
  description="Create matching pairs for students"
  bgClass="bg-blue-100"
  iconClass="text-blue-600"
  actions={<Button>Save</Button>}
>
  {/* Form content here */}
</IconHeaderCard>;
```

### Design Pattern

```
┌─────────────────────────────────────────────────────────┐
│  [Icon Badge]  Title                          [Actions] │
│                Description                               │
│                                                          │
│  {children content here}                                │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Benefits

- **Consistency**: All plugins share the same header design
- **Reusability**: Can be used for any card with icon header
- **Maintainability**: Single source of truth for header styling
- **Flexibility**: Optional actions slot for future extensibility
- **Type Safety**: Full TypeScript support

---

## Compose Page Architecture

### Refactoring Overview

The compose page was refactored from a monolithic 400+ line component into a clean, modular structure following React best practices.

**Key Architecture Notes**:

- Main page file is at `pages/compose.tsx` (not in a compose subfolder)
- UI components are organized in `components/compose/` directory
- Business logic is centralized in `hooks/useComposeContent.ts`
- Plugin configurations and implementations are in `constants/compose.tsx` (~1019 lines)
- Type definitions are in `types/compose.ts`
- This structure separates concerns while keeping related code discoverable

### File Structure

```
src/domains/authoring/
├── pages/
│   └── compose.tsx              # Main page orchestration (~70 lines)
├── components/
│   └── compose/                 # Compose UI components
│       ├── ComposeHeader.tsx   # Title, breadcrumb, save/publish
│       ├── ComposeSidebar.tsx  # Plugin selector
│       ├── ComposeMainContent.tsx  # Content blocks display
│       ├── ContentBlockCard.tsx    # Individual block wrapper
│       └── index.ts            # Component exports
├── hooks/
│   └── useComposeContent.ts    # Business logic & state
├── constants/
│   └── compose.tsx              # PLUGIN_CONFIGS & inline implementations (~1019 lines)
└── types/
    └── compose.ts               # TypeScript definitions
```

### Component Responsibilities

#### ComposeHeader

- Display lesson title and breadcrumb
- Show save/publish actions
- Handle lesson metadata updates

#### ComposeSidebar

- Display available plugins
- Show plugin icons and descriptions
- Handle plugin selection and insertion

#### ComposeMainContent

- Render content blocks in sequence
- Handle block reordering (drag & drop)
- Manage empty state display

#### ContentBlockCard

- Wrap each content block
- Provide move/delete actions
- Display block preview or editor

### Custom Hook: useComposeContent

**Location**: `src/domains/authoring/hooks/useComposeContent.ts`

**Responsibilities**:

- Lesson data fetching
- Content block management (add, update, delete, reorder)
- Plugin selection state
- Mutations for save/publish

**API**:

```typescript
const {
  lesson, // Current lesson data
  isLoading, // Loading state
  contentBlocks, // Array of content blocks
  selectedPlugin, // Currently selected plugin
  setSelectedPlugin, // Plugin selection
  addContentBlock, // Add new block
  updateContentBlock, // Update existing block
  deleteContentBlock, // Remove block
  reorderBlocks, // Change block order
  saveLesson, // Save draft
  publishLesson, // Publish lesson
} = useComposeContent(lessonId);
```

---

## Data Flow

### Content Block Lifecycle

```
1. User selects plugin from sidebar
   ↓
2. selectedPlugin state updated
   ↓
3. User clicks "Add to Lesson"
   ↓
4. addContentBlock() creates new block with default data
   ↓
5. ContentBlockCard renders plugin in edit mode
   ↓
6. User edits content (title, instructions, options, etc.)
   ↓
7. onChange callback updates block data
   ↓
8. updateContentBlock() syncs to local state
   ↓
9. User clicks "Save Lesson"
   ↓
10. saveLesson() mutation sends to backend
```

### State Management

```
React Query (Server State)
├── Lesson metadata
├── Content blocks
└── Folder structure

Local State (useComposeContent)
├── selectedPlugin
├── contentBlocks (optimistic updates)
└── UI state (loading, errors)

No Zustand Required
└── Compose page is self-contained
```

---

## API Integration

### Queries

**Location**: `src/domains/authoring/queries/content.ts`

```typescript
// Fetch lesson with content blocks
export const useLessonQuery = (lessonId: string) => {
  return useQuery({
    queryKey: ["lessons", lessonId],
    queryFn: () => fetchLesson(lessonId),
  });
};
```

### Mutations

```typescript
// Save lesson content
export const useSaveLessonMutation = () => {
  return useMutation({
    mutationFn: (data: SaveLessonData) => saveLesson(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["lessons"]);
    },
  });
};

// Publish lesson
export const usePublishLessonMutation = () => {
  return useMutation({
    mutationFn: (lessonId: string) => publishLesson(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries(["lessons"]);
    },
  });
};
```

### Expected Backend Endpoints

```typescript
GET    /service/v1/lessons/:id              # Fetch lesson
PATCH  /service/v1/lessons/:id/content      # Update content blocks
POST   /service/v1/lessons/:id/publish      # Publish lesson
DELETE /service/v1/lessons/:id/blocks/:blockId  # Delete block
```

---

## Plugin Configuration

### PLUGIN_CONFIGS Constant

**Location**: `src/domains/authoring/constants/compose.tsx`

**Note**: This file (~1019 lines) contains not only the PLUGIN_CONFIGS array but also inline plugin implementations with full editor and preview components. It includes all the interactive logic, drag-and-drop functionality using @dnd-kit, and complete rendering code for each plugin type.

```typescript
export const PLUGIN_CONFIGS = [
  {
    id: "matching",
    name: "Matching",
    icon: Shuffle,
    description: "Match items from two columns",
    bgClass: "bg-blue-100",
    iconClass: "text-blue-600",
    component: MatchingPlugin,
  },
  {
    id: "fill-in-blank",
    name: "Fill in Blank",
    icon: FileText,
    description: "Complete missing words in a passage",
    bgClass: "bg-green-100",
    iconClass: "text-green-600",
    component: FillInBlankPlugin,
  },
  {
    id: "multiple-choice",
    name: "Multiple Choice",
    icon: ListChecks,
    description: "Choose one or multiple correct answers",
    bgClass: "bg-purple-100",
    iconClass: "text-purple-600",
    component: MultipleChoicePlugin,
  },
  {
    id: "drag-drop",
    name: "Drag & Drop",
    icon: Move,
    description: "Categorize items by dragging them",
    bgClass: "bg-orange-100",
    iconClass: "text-orange-600",
    component: DragDropPlugin,
  },
] as const;
```

### Adding New Plugins

To add a new plugin:

1. **Create plugin component** in `src/domains/authoring/components/lexical-editor/plugins/{plugin-name}/`
2. **Use IconHeaderCard** for consistent header styling
3. **Choose unique color theme** (e.g., `bg-teal-100`, `text-teal-600`)
4. **Select Lucide icon** that represents the plugin
5. **Add to PLUGIN_CONFIGS** in `constants/compose.tsx`
6. **Export from** `plugins/index.ts`

Example new plugin config:

```typescript
{
  id: 'true-false',
  name: 'True/False',
  icon: CheckCircle,
  description: 'True or false questions',
  bgClass: 'bg-teal-100',
  iconClass: 'text-teal-600',
  component: TrueFalsePlugin,
}
```

---

## Type Definitions

### Core Types

**Location**: `src/domains/authoring/types/compose.ts`

```typescript
// Base content block structure
export interface ContentBlock {
  id: string;
  type: "matching" | "fill-in-blank" | "multiple-choice" | "drag-drop";
  order: number;
  data: unknown; // Plugin-specific data
}

// Plugin-specific data types
export interface MatchingData {
  title: string;
  instructions: string;
  pairs: Array<{
    id: string;
    left: string;
    right: string;
  }>;
}

// ... similar for other plugins
```

### Plugin Editor Types

**Location**: `src/domains/authoring/components/lexical-editor/types.ts`

```typescript
export interface PluginEditorProps<T> {
  data: T;
  onChange: (data: T) => void;
  onSave?: () => void;
  onCancel?: () => void;
}

export interface PluginPreviewProps<T> {
  data: T;
}
```

---

## Styling Conventions

### Color Themes

Each plugin has a unique color theme for visual distinction:

| Plugin          | Background      | Icon/Text         | Hex Code |
| --------------- | --------------- | ----------------- | -------- |
| Matching        | `bg-blue-100`   | `text-blue-600`   | #2563EB  |
| Fill in Blank   | `bg-green-100`  | `text-green-600`  | #16A34A  |
| Multiple Choice | `bg-purple-100` | `text-purple-600` | #9333EA  |
| Drag & Drop     | `bg-orange-100` | `text-orange-600` | #EA580C  |

**Available for future plugins**: Teal, Pink, Indigo, Cyan, Red, Yellow

### Tailwind Classes

Common patterns used:

- **Spacing**: `space-y-4`, `gap-3`, `p-6`
- **Layout**: `flex`, `items-center`, `justify-between`
- **Borders**: `rounded-lg`, `border`
- **Sizing**: `h-5`, `w-5`, `shrink-0`
- **Typography**: `text-lg`, `font-semibold`, `text-muted-foreground`

---

## Performance Considerations

### Optimizations Implemented

1. **React Query Caching**: Lessons and content blocks are cached
2. **Optimistic Updates**: UI updates immediately, syncs to server
3. **Lazy Loading**: Plugins loaded on-demand
4. **Memoization**: Plugin components use React.memo
5. **Debounced Auto-save**: Content auto-saves after 2s of inactivity

### Best Practices

- Use `useMemo` for expensive computations
- Use `useCallback` for event handlers passed to children
- Avoid unnecessary re-renders with proper dependency arrays
- Keep component tree shallow

---

## Testing Strategy

### Unit Tests

Test individual plugin components:

```typescript
describe("MatchingPlugin", () => {
  it("renders with initial data", () => {
    // Test component rendering
  });

  it("adds new pair on button click", () => {
    // Test interaction
  });

  it("calls onChange when data updates", () => {
    // Test callback
  });
});
```

### Integration Tests

Test compose page workflow:

```typescript
describe("Compose Page", () => {
  it("loads lesson data on mount", () => {
    // Test data fetching
  });

  it("adds content block when plugin selected", () => {
    // Test block creation
  });

  it("saves lesson on save button click", () => {
    // Test mutation
  });
});
```

### E2E Tests

Test complete user flow:

```typescript
test("create lesson with multiple content blocks", async () => {
  // 1. Navigate to compose page
  // 2. Select plugin
  // 3. Fill content
  // 4. Add multiple blocks
  // 5. Save lesson
  // 6. Verify data saved
});
```

---

## Migration Guide

### From Old Compose Page

If upgrading from the previous compose implementation:

1. **Remove old files**:

   - Delete monolithic compose component
   - Remove inline state management

2. **Install dependencies**:

   ```bash
   pnpm add lexical@0.39.0 @lexical/react@0.39.0
   pnpm add @dnd-kit/core@6.3.1 @dnd-kit/sortable@10.0.0 @dnd-kit/utilities@3.2.2
   ```

3. **Copy new structure**:

   - Copy `pages/compose.tsx` main page
   - Copy `components/compose/` folder (all compose components)
   - Copy `hooks/useComposeContent.ts`
   - Copy `constants/compose.tsx` (includes PLUGIN_CONFIGS)
   - Copy `types/compose.ts`
   - Copy `components/lexical-editor/` folder
   - Copy `shared/components/ui/icon-header-card.tsx`

4. **Update routes**:

   ```typescript
   // router.ts
   {
     path: '/compose/:lessonId',
     component: () => import('./pages/compose'),
   }
   ```

5. **Test thoroughly**:
   - Verify all plugins render correctly
   - Test save/publish functionality
   - Check responsive design

---

## Future Enhancements

### Planned Features

1. **Rich Text Support**: Add formatting toolbar to text fields
2. **Image Upload**: Allow images in questions/instructions
3. **Audio/Video**: Support multimedia content
4. **Collaborative Editing**: Real-time co-authoring
5. **Version History**: Track changes and rollback
6. **Templates**: Pre-built content templates
7. **Import/Export**: Support for SCORM, xAPI, QTI formats
8. **Analytics**: Track content creation patterns

### Plugin Ideas

- **True/False**: Simple binary questions
- **Short Answer**: Text input questions
- **Essay**: Long-form responses
- **Hotspot**: Click areas on images
- **Ordering**: Sequence items in correct order
- **Crossword**: Interactive crossword puzzles
- **Flashcards**: Flip card study mode

### Architecture Improvements

- **Plugin Marketplace**: Allow custom plugin installation
- **Plugin SDK**: Provide tools for third-party plugin development
- **Theme System**: Allow custom color themes
- **Accessibility**: WCAG 2.1 AA compliance
- **Offline Mode**: Work without internet connection
- **Mobile Optimization**: Touch-friendly interface

---

## Troubleshooting

### Common Issues

#### Issue: Plugin not rendering

**Symptom**: Plugin component shows blank or error

**Solutions**:

1. Check PLUGIN_CONFIGS includes plugin
2. Verify component export in `plugins/index.ts`
3. Check data structure matches plugin expectations
4. Look for console errors

#### Issue: Data not saving

**Symptom**: Changes lost on page refresh

**Solutions**:

1. Check backend API endpoints are correct
2. Verify mutation is called with correct data
3. Check network tab for failed requests
4. Ensure queryClient.invalidateQueries() is called

#### Issue: Styling inconsistent

**Symptom**: Plugin header looks different

**Solutions**:

1. Ensure using IconHeaderCard component
2. Check bgClass and iconClass props are passed
3. Verify Tailwind classes are not purged
4. Check component uses correct structure

#### Issue: Type errors

**Symptom**: TypeScript compilation fails

**Solutions**:

1. Run `pnpm run build` to see full errors
2. Check imports use correct paths
3. Verify data types match plugin expectations
4. Update types.ts if needed

---

## Resources

### Documentation

- **Lexical Docs**: https://lexical.dev/docs/intro
- **TanStack Query**: https://tanstack.com/query/latest
- **Lucide Icons**: https://lucide.dev
- **Tailwind CSS**: https://tailwindcss.com

### Related Files

- `WORKSPACE_CONTEXT.md`: Overall project context (root level)
- `LESSON_CREATION_IMPLEMENTATION_PLAN.md`: Backend implementation plan (root level)
- `CONTENT_EDITOR_ARCHITECTURE.md`: This file - comprehensive editor documentation
- `components/lexical-editor/README.md`: Lexical editor technical details
- `docs/PROJECT_INTRODUCTION.md`: Project overview with content editor section

### Support

For questions or issues:

1. Check this documentation first
2. Review related markdown files
3. Check console for errors
4. Review git history for recent changes

---

## Changelog

### 2025-12-13

- ✅ Integrated Lexical 0.39.0
- ✅ Created 4 custom content plugins
- ✅ Built IconHeaderCard reusable component
- ✅ Refactored compose page to modular structure
- ✅ Added content CRUD with React Query
- ✅ Documented architecture

### 2025-12-08

- ✅ Initial compose page implementation
- ✅ Basic lesson creation flow

---

**End of Content Editor Architecture Document**

This document should be updated when:

- New plugins are added
- Architecture changes are made
- New features are implemented
- Best practices are discovered
