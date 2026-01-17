# Composer & Versioning Feature Update (Jan 17, 2026)

## Summary

Major enhancements to the Lesson Composer, including 4 new interactive plugins, improved sidebar navigation with outline view, and robust version control system.

## Frontend (`bravo-learning-system`)

### New Features

#### 1. Composer Plugins

- **Ordering Plugin**: New interactive question type for arranging items in sequence.
- **Flashcard Plugin**: Double-sided study cards with flip animation.
- **Poll Plugin**: Real-time polling component with percentage visualization.
- **Code Block Plugin**: Syntax-highlighted code editor with execution sandbox.

#### 2. Sidebar Navigation

- **Tabbed Interface**: Switched to "Add" vs "Outline" tabs for better organization.
- **Outline View**:
  - Drag-and-drop reordering of content blocks.
  - Quick navigation (scroll-to-block).
  - Validation status indicators (warning icons for incomplete blocks).
  - Context menu for Copy/Delete actions.

#### 3. Version Control

- **Version Graph Dialog**: Visual history of branches and versions.
- **Branching**: Ability to create and switch between feature branches for lessons.

### Technical Improvements

- **Linting**: Resolved `react-refresh` issues by refactoring plugins to separate component exports.
- **Type Safety**: Improved typing in `useComposeContent` hook.

## Backend (`bravo-learning-service`)

### Database

- **Schema Updates**: Added `deleted_at` support for soft deletes in working desk and versioning tables.
- **Versioning Support**: Enhanced schema to support complex branching and version history.

### API

- **Versioning Service**: Updated logic to handle branch creation, merging (in progress), and version retrieval.
- **Lesson Service**: Integrated with new versioning capabilities.

## Usage

- Access the new plugins via the "Add" tab in the Composer sidebar.
- Manage lesson structure using the "Outline" tab.
- View version history by clicking the branch/version indicator in the header.
