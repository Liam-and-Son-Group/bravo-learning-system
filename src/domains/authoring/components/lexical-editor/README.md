# Lexical Editor - Plugin Architecture

## Overview

A flexible, extensible content editor built on **Lexical** with a plug-and-play plugin system. Create interactive learning content with modular components.

## Architecture

```
lexical-editor/
├── core/
│   └── LexicalEditorCore.tsx    # Base editor with Lexical integration
├── plugins/
│   ├── matching/
│   │   └── MatchingPlugin.tsx   # Matching pairs module
│   ├── fill-in-blank/
│   │   └── FillInBlankPlugin.tsx # Fill in blank module
│   └── index.ts                 # Plugin registry
├── types.ts                      # TypeScript interfaces
└── index.ts                      # Public exports
```

## Core Concepts

### 1. Plugin Interface

All plugins implement the `EditorPlugin` interface:

```typescript
interface EditorPlugin {
  id: string; // Unique identifier
  name: string; // Display name
  type: "content" | "toolbar" | "inline";
  icon?: React.ComponentType; // Icon for toolbar
  initialize: (editor: LexicalEditor) => void;
  cleanup?: () => void;
}
```

### 2. Content Plugin

Content plugins create interactive content blocks:

```typescript
interface ContentPlugin extends EditorPlugin {
  type: "content";
  renderEditor: (props: ContentEditorProps) => ReactNode;
  renderPreview: (data: any) => ReactNode;
  serialize: (data: any) => any;
  deserialize: (json: any) => any;
}
```

### 3. Content Block

Each content block represents a module instance:

```typescript
interface ContentBlock {
  id: string;
  pluginId: string;
  data: any; // Plugin-specific data
  createdAt: number;
  updatedAt: number;
}
```

## Built-in Plugins

### 1. Matching Plugin

Creates matching pair exercises where students connect items from left to right columns.

**Features:**

- Add/remove pairs dynamically
- Drag-and-drop reordering
- Shuffle option for randomization
- Title and instructions
- Alternative answers support

**Data Structure:**

```typescript
interface MatchingData {
  type: "matching";
  title?: string;
  instructions?: string;
  items: Array<{ id: string; left: string; right: string }>;
  shuffle?: boolean;
}
```

### 2. Fill in Blank Plugin

Creates fill-in-the-blank exercises with text containing blanks marked by `_____`.

**Features:**

- Multiple blanks per question
- Alternative acceptable answers
- Case-sensitive option
- Title and instructions
- Preview with interactive input fields

**Data Structure:**

```typescript
interface FillInBlankData {
  type: "fill-in-blank";
  title?: string;
  instructions?: string;
  items: Array<{
    id: string;
    text: string; // "The capital is _____"
    answer: string;
    alternatives?: string[];
  }>;
  caseSensitive?: boolean;
}
```

## Usage

### Basic Integration

```typescript
import {
  LexicalEditorCore,
  DEFAULT_PLUGINS,
} from "@/domains/authoring/components/lexical-editor";

function MyEditor() {
  return (
    <LexicalEditorCore
      plugins={DEFAULT_PLUGINS}
      onChange={(content) => console.log(content)}
      editable={true}
      placeholder="Start creating content..."
    />
  );
}
```

### Using Individual Plugins

```typescript
import {
  MatchingPlugin,
  FillInBlankPlugin,
} from "@/domains/authoring/components/lexical-editor";

const [contentBlock, setContentBlock] = useState({
  id: "1",
  pluginId: "matching",
  data: {
    type: "matching",
    items: [{ id: "1", left: "France", right: "Paris" }],
  },
});

// Render editor
{
  MatchingPlugin.renderEditor({
    data: contentBlock.data,
    onChange: (data) => setContentBlock({ ...contentBlock, data }),
    editable: true,
  });
}

// Render preview
{
  MatchingPlugin.renderPreview(contentBlock.data);
}
```

### Complete Example (Compose Page)

See `/domains/authoring/pages/compose/index.tsx` for a full implementation with:

- Add content block buttons
- Edit/Preview tabs
- Multiple content blocks
- Save functionality

## Creating a New Plugin

### Step 1: Define Data Structure

```typescript
// types.ts
export interface MyCustomData {
  type: "my-custom";
  title: string;
  items: Array<{ id: string; content: string }>;
}
```

### Step 2: Create Plugin

```typescript
// plugins/my-custom/MyCustomPlugin.tsx
import type { ContentPlugin } from "../../types";

export const MyCustomPlugin: ContentPlugin = {
  id: "my-custom",
  name: "My Custom Module",
  type: "content",
  icon: MyIcon,

  initialize: (editor) => {
    // Register custom Lexical nodes, commands, etc.
  },

  renderEditor: ({ data, onChange, editable }) => {
    return <MyCustomEditor data={data} onChange={onChange} />;
  },

  renderPreview: (data) => {
    return <MyCustomPreview data={data} />;
  },

  serialize: (data) => JSON.stringify(data),
  deserialize: (json) => JSON.parse(json),
};
```

### Step 3: Register Plugin

```typescript
// plugins/index.ts
export { MyCustomPlugin } from "./my-custom/MyCustomPlugin";

export const DEFAULT_PLUGINS = [
  MatchingPlugin,
  FillInBlankPlugin,
  MyCustomPlugin, // Add your plugin
];
```

## Plugin Guidelines

### ✅ Best Practices

1. **Self-contained**: Each plugin should be independent
2. **Type-safe**: Use TypeScript interfaces for all data
3. **Serializable**: Data must be JSON-serializable
4. **Reversible**: Implement both serialize/deserialize
5. **Accessible**: Follow WCAG guidelines
6. **Responsive**: Support mobile and desktop

### ⚠️ Important Notes

- Plugin IDs must be unique across all plugins
- Data structures should be versioned for migration
- Always validate data in deserialize()
- Handle empty/invalid data gracefully
- Test preview mode thoroughly

## API Reference

### ContentEditorProps

```typescript
interface ContentEditorProps {
  data: any; // Current content data
  onChange: (data: any) => void; // Update handler
  editable: boolean; // Edit mode flag
}
```

### Plugin Methods

- `initialize(editor)` - Called once when plugin loads
- `renderEditor(props)` - Render edit UI
- `renderPreview(data)` - Render student-facing view
- `serialize(data)` - Convert to JSON
- `deserialize(json)` - Parse from JSON
- `cleanup()` - Optional cleanup on unmount

## Future Extensions

Planned plugin types:

- **Multiple Choice** - Single/multi-select questions
- **Drag and Drop** - Reorder or categorize items
- **Hotspot** - Click areas on images
- **Timeline** - Chronological events
- **Code Editor** - Programming exercises
- **Audio Recorder** - Voice responses
- **Drawing Canvas** - Sketch answers

## Technical Details

### Dependencies

- `lexical` - Core editor engine
- `@lexical/react` - React bindings
- React 18+ for components
- TypeScript for type safety

### Performance

- Lazy load plugins on demand
- Memoize expensive renders
- Debounce onChange events
- Virtual scrolling for large lists

### Testing

```bash
# Run tests
npm test

# Test individual plugin
npm test -- MatchingPlugin
```

## Contributing

1. Follow the plugin template
2. Add TypeScript types
3. Write unit tests
4. Document data structure
5. Add to DEFAULT_PLUGINS

## License

MIT
