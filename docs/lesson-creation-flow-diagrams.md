# Lesson Creation Flow - Visual Documentation

**Companion to**: [lesson-creation-api-spec.md](./lesson-creation-api-spec.md)  
**Purpose**: Visual flow diagrams and sequence diagrams for backend team  
**Date**: December 7, 2025

---

## Table of Contents

1. [Complete User Flow](#complete-user-flow)
2. [System Sequence Diagram](#system-sequence-diagram)
3. [Data Flow Diagram](#data-flow-diagram)
4. [State Transitions](#state-transitions)
5. [Error Flow Handling](#error-flow-handling)

---

## Complete User Flow

```mermaid
flowchart TD
    Start([Teacher on /authoring page]) --> Click[Click 'Create new lesson' button]
    Click --> Modal[Modal Opens]
    Modal --> Step1[Step 1: Select Type]

    Step1 --> TypeChoice{Choose Content Type}
    TypeChoice -->|Assessment| SelectAssess[Assessment Selected]
    TypeChoice -->|Lesson| SelectLesson[Lesson Selected]
    TypeChoice -->|Puzzle Game| SelectPuzzle[Puzzle Game Selected]
    TypeChoice -->|Custom Game| SelectCustom[Custom Game Selected]

    SelectAssess --> Next1[Click Next]
    SelectLesson --> Next1
    SelectPuzzle --> Next1
    SelectCustom --> Next1

    Next1 --> ValidateType{Type Selected?}
    ValidateType -->|No| Step1
    ValidateType -->|Yes| Step2[Step 2: Configuration]

    Step2 --> LoadFolders[Load Folders from API]
    LoadFolders --> FolderSuccess{Folders Loaded?}
    FolderSuccess -->|No| ShowRootOnly[Show Root Folder Only]
    FolderSuccess -->|Yes| ShowFolders[Show All Folders]

    ShowRootOnly --> FormDisplay[Display Form Fields]
    ShowFolders --> FormDisplay

    FormDisplay --> FillForm[User Fills Form:<br/>- Name ✓<br/>- Branch<br/>- Visibility<br/>- Folder]

    FillForm --> Create[Click Create]
    Create --> ValidateForm{Form Valid?}
    ValidateForm -->|No: Name Empty| FormDisplay
    ValidateForm -->|Yes| APICall[POST /service/v1/lessons]

    APICall --> APIResponse{API Response?}

    APIResponse -->|201 Success| ShowToast[Show Success Toast]
    ShowToast --> Navigate[Navigate to Compose Page:<br/>/authoring/compose/{lessonId}]
    Navigate --> ComposeLoad[Load Compose Page with Lesson]
    ComposeLoad --> End([User Edits Content])

    APIResponse -->|400 Bad Request| ShowError[Show Validation Error]
    APIResponse -->|403 Forbidden| ShowPermError[Show Permission Error]
    APIResponse -->|404 Not Found| ShowNotFound[Show Folder Not Found]
    APIResponse -->|500 Server Error| ShowServerError[Show Server Error]

    ShowError --> FormDisplay
    ShowPermError --> ModalStay[Stay on Modal]
    ShowNotFound --> FormDisplay
    ShowServerError --> ModalStay

    Step2 --> Back[Click Back]
    Back --> Step1

    style Start fill:#e1f5e1
    style End fill:#e1f5e1
    style APICall fill:#ffe1e1
    style Step1 fill:#e1e5ff
    style Step2 fill:#e1e5ff
    style ShowError fill:#ffe1e1
    style ShowPermError fill:#ffe1e1
    style ShowNotFound fill:#ffe1e1
    style ShowServerError fill:#ffe1e1
```

---

## System Sequence Diagram

```mermaid
sequenceDiagram
    actor Teacher
    participant FE as Frontend<br/>(React App)
    participant Dialog as CreateLessonDialog<br/>(Component)
    participant API as Backend API
    participant DB as Database
    participant Auth as Auth Service

    Note over Teacher,DB: Phase 1: Dialog Open & Folder Loading
    Teacher->>FE: Click "Create new lesson"
    FE->>Dialog: Open modal (Step 1)
    Dialog->>Dialog: Show type selection cards

    Note over Teacher,DB: Phase 2: Type Selection
    Teacher->>Dialog: Select "Assessment" type
    Dialog->>Dialog: Update state: type = "assessment"
    Teacher->>Dialog: Click "Next"
    Dialog->>Dialog: Validate type selected ✓
    Dialog->>Dialog: Navigate to Step 2

    Note over Teacher,DB: Phase 3: Folder Loading
    Dialog->>FE: Request folders
    FE->>API: GET /service/v1/folders?organizationId=org_123
    API->>Auth: Verify JWT token
    Auth-->>API: User authenticated
    API->>DB: SELECT * FROM folders WHERE organization_id='org_123'
    DB-->>API: Return folders
    API-->>FE: 200 OK + folder list
    FE-->>Dialog: Populate folder dropdown

    Note over Teacher,DB: Phase 4: Form Configuration
    Teacher->>Dialog: Enter name: "Quiz 1"
    Teacher->>Dialog: Leave branch: "main" (default)
    Teacher->>Dialog: Select visibility: "private"
    Teacher->>Dialog: Select folder: "Math - Grade 10"
    Teacher->>Dialog: Click "Create"

    Note over Teacher,DB: Phase 5: Validation & Submission
    Dialog->>Dialog: Validate form<br/>- type: ✓<br/>- name: ✓ (not empty)
    Dialog->>FE: Call createLesson mutation

    FE->>API: POST /service/v1/lessons<br/>{<br/>  type: "assessment",<br/>  name: "Quiz 1",<br/>  mainBranch: "main",<br/>  visibility: "private",<br/>  folderId: "fld_abc123"<br/>}

    API->>Auth: Extract user from JWT
    Auth-->>API: userId: "user_xyz789"<br/>orgId: "org_school456"

    API->>API: Validate payload<br/>- type enum ✓<br/>- name length ✓<br/>- branch format ✓<br/>- visibility enum ✓

    API->>DB: SELECT * FROM folders WHERE id='fld_abc123'
    DB-->>API: Folder exists, org matches ✓

    API->>API: Generate slug: "quiz-1"
    API->>API: Create lesson entity

    API->>DB: BEGIN TRANSACTION
    API->>DB: INSERT INTO lessons (...)
    DB-->>API: Lesson created: lesson_9x8y7z6

    API->>DB: INSERT INTO lesson_versions (version #1)
    DB-->>API: Version created: ver_initial_001

    API->>DB: COMMIT TRANSACTION

    API-->>FE: 201 Created<br/>{<br/>  success: true,<br/>  data: {<br/>    id: "lesson_9x8y7z6",<br/>    type: "assessment",<br/>    name: "Quiz 1",<br/>    ...<br/>  }<br/>}

    Note over Teacher,DB: Phase 6: Navigation
    FE->>FE: Show success toast
    FE->>FE: Navigate to /authoring/compose/lesson_9x8y7z6
    FE-->>Teacher: Compose page loaded

    Note over Teacher,DB: Alternative Flow: Validation Error
    rect rgb(255, 230, 230)
        Note over API,DB: If validation fails
        API-->>FE: 400 Bad Request<br/>{<br/>  success: false,<br/>  errorCode: "VALIDATION_ERROR",<br/>  errors: [...]<br/>}
        FE-->>Teacher: Show error toast + keep modal open
    end

    Note over Teacher,DB: Alternative Flow: Permission Denied
    rect rgb(255, 230, 230)
        Note over API,Auth: If user lacks permissions
        API->>Auth: Check permissions
        Auth-->>API: Permission denied
        API-->>FE: 403 Forbidden
        FE-->>Teacher: Show permission error
    end
```

---

## Data Flow Diagram

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[User Interface<br/>CreateLessonDialog]
        State[React State<br/>formData]
        Query[TanStack Query<br/>useCreateLessonMutation]
    end

    subgraph "Network Layer"
        HTTP[HTTP Request<br/>Axios + authInstance]
        JWT[JWT Token<br/>Authorization Header]
    end

    subgraph "Backend Layer"
        Router[Express Router<br/>/service/v1/lessons]
        Auth[Auth Middleware<br/>JWT Verification]
        Validator[Validation Layer<br/>Joi/Zod Schema]
        Controller[Lesson Controller<br/>Business Logic]
        Service[Lesson Service<br/>Data Operations]
    end

    subgraph "Data Layer"
        LessonRepo[Lesson Repository]
        FolderRepo[Folder Repository]
        VersionRepo[Version Repository]
        DB[(PostgreSQL/MySQL<br/>Database)]
    end

    %% Frontend Flow
    UI -->|User Input| State
    State -->|Form Data| Query
    Query -->|API Call| HTTP
    HTTP -->|Bearer Token| JWT

    %% Network to Backend
    JWT --> Router
    Router --> Auth
    Auth -->|Valid Token| Validator
    Validator -->|Valid Payload| Controller

    %% Backend Processing
    Controller -->|Create Lesson| Service
    Service -->|Insert Lesson| LessonRepo
    Service -->|Verify Folder| FolderRepo
    Service -->|Create Version| VersionRepo

    %% Database Operations
    LessonRepo --> DB
    FolderRepo --> DB
    VersionRepo --> DB

    %% Response Flow
    DB -->|Data| Service
    Service -->|Lesson Entity| Controller
    Controller -->|Success Response| Router
    Router -->|HTTP 201| HTTP
    HTTP -->|Response Data| Query
    Query -->|Update State| UI

    %% Error Paths
    Auth -.->|401 Unauthorized| Router
    Validator -.->|400 Bad Request| Router
    Controller -.->|403/404/500| Router

    style UI fill:#e3f2fd
    style State fill:#e3f2fd
    style Query fill:#e3f2fd
    style Router fill:#fff3e0
    style Controller fill:#fff3e0
    style Service fill:#fff3e0
    style DB fill:#f3e5f5
```

---

## State Transitions

### Lesson Status State Machine

```mermaid
stateDiagram-v2
    [*] --> Draft: Lesson Created<br/>(POST /lessons)

    Draft --> Draft: Edit Content<br/>(PATCH /lessons/{id})
    Draft --> Published: Publish<br/>(POST /lessons/{id}/publish)
    Draft --> Archived: Archive<br/>(DELETE /lessons/{id})

    Published --> Draft: Unpublish<br/>(POST /lessons/{id}/unpublish)
    Published --> Archived: Archive<br/>(DELETE /lessons/{id})
    Published --> Published: Update Published Version<br/>(PATCH /lessons/{id})

    Archived --> Draft: Restore<br/>(POST /lessons/{id}/restore)
    Archived --> [*]: Permanent Delete<br/>(DELETE /lessons/{id}?permanent=true)

    note right of Draft
        Initial state after creation
        Editable by author
        Not visible to students
    end note

    note right of Published
        Visible to students
        Can create new versions
        Maintains version history
    end note

    note right of Archived
        Soft deleted
        Can be restored within 30 days
        Not visible in lists
    end note
```

### Dialog Step State

```mermaid
stateDiagram-v2
    [*] --> Closed: Dialog Closed
    Closed --> Step1_Open: User clicks<br/>"Create new lesson"

    Step1_Open --> Step1_TypeSelected: User selects type
    Step1_TypeSelected --> Step1_Open: User deselects type
    Step1_TypeSelected --> Step2_Loading: Click "Next"

    Step2_Loading --> Step2_Ready: Folders loaded
    Step2_Loading --> Step2_Error: Folder load failed
    Step2_Error --> Step2_Ready: Retry successful

    Step2_Ready --> Step2_Filling: User inputs data
    Step2_Filling --> Step2_Ready: Data cleared
    Step2_Filling --> Submitting: Click "Create"
    Step2_Ready --> Step1_TypeSelected: Click "Back"

    Submitting --> Success: API 201 Created
    Submitting --> Error: API 4xx/5xx

    Success --> Navigating: Show toast
    Navigating --> [*]: Navigate to compose

    Error --> Step2_Ready: Show error toast

    Closed --> [*]: User closes without action
    Step1_Open --> Closed: User closes dialog
    Step2_Ready --> Closed: User closes dialog

    note right of Step1_Open
        type = null
        currentStep = 0
    end note

    note right of Step2_Ready
        type = "assessment"
        currentStep = 1
        folders loaded
    end note

    note right of Submitting
        Button disabled
        Loading indicator shown
    end note
```

---

## Error Flow Handling

### Validation Error Flow

```mermaid
flowchart LR
    subgraph Frontend
        Form[User Submits Form]
        FEValidate{Frontend<br/>Validation}
        SendAPI[Send to API]
    end

    subgraph Backend
        BEValidate{Backend<br/>Validation}
        FieldErrors[Generate<br/>Field Errors]
        Response400[Return 400<br/>Bad Request]
    end

    subgraph Error Display
        Toast[Show Error Toast]
        FieldHighlight[Highlight Invalid Fields]
        KeepModal[Keep Modal Open]
    end

    Form --> FEValidate
    FEValidate -->|Pass| SendAPI
    FEValidate -->|Fail| FieldHighlight

    SendAPI --> BEValidate
    BEValidate -->|Pass| Success[201 Created]
    BEValidate -->|Fail| FieldErrors

    FieldErrors --> Response400
    Response400 --> Toast
    Toast --> FieldHighlight
    FieldHighlight --> KeepModal

    style FEValidate fill:#fff9c4
    style BEValidate fill:#fff9c4
    style Response400 fill:#ffcdd2
    style Toast fill:#ffcdd2
```

### Permission Error Flow

```mermaid
flowchart TD
    Request[User Submits Form] --> ExtractToken[Extract JWT Token]
    ExtractToken --> ValidToken{Token Valid?}

    ValidToken -->|No| Return401[401 Unauthorized]
    ValidToken -->|Yes| CheckPerms[Check Permissions]

    CheckPerms --> HasPerm{Has content.create<br/>permission?}

    HasPerm -->|No| Return403[403 Forbidden]
    HasPerm -->|Yes| CheckOrg{Belongs to<br/>organization?}

    CheckOrg -->|No| Return400[400 Bad Request<br/>ORGANIZATION_NOT_FOUND]
    CheckOrg -->|Yes| Proceed[Proceed with Creation]

    Return401 --> ShowAuth[Show Login Prompt]
    Return403 --> ShowPerm[Show Permission Error<br/>'Contact Admin']
    Return400 --> ShowOrg[Show Organization Error<br/>'Setup Required']

    Proceed --> CreateLesson[Create Lesson]

    style Return401 fill:#ffcdd2
    style Return403 fill:#ffcdd2
    style Return400 fill:#ffcdd2
    style CreateLesson fill:#c8e6c9
```

### Network Error Flow

```mermaid
flowchart LR
    Submit[Submit Form] --> API{API Call}

    API -->|Success 201| HandleSuccess[Parse Response]
    API -->|Client Error 4xx| HandleClient[Parse Error Message]
    API -->|Server Error 5xx| HandleServer[Generic Error]
    API -->|Network Timeout| HandleTimeout[Timeout Message]
    API -->|Network Error| HandleNetwork[Connection Error]

    HandleSuccess --> Toast1[Success Toast]
    Toast1 --> Navigate[Navigate to Compose]

    HandleClient --> Toast2[Error Toast:<br/>Show specific message]
    Toast2 --> Stay1[Stay on Modal]

    HandleServer --> Toast3[Error Toast:<br/>'Server error, try again']
    Toast3 --> Stay2[Stay on Modal]

    HandleTimeout --> Toast4[Error Toast:<br/>'Request timeout']
    Toast4 --> RetryBtn1[Show Retry Button]

    HandleNetwork --> Toast5[Error Toast:<br/>'Check connection']
    Toast5 --> RetryBtn2[Show Retry Button]

    RetryBtn1 --> Submit
    RetryBtn2 --> Submit

    style API fill:#fff9c4
    style HandleSuccess fill:#c8e6c9
    style HandleClient fill:#ffcdd2
    style HandleServer fill:#ffcdd2
    style HandleTimeout fill:#ffcdd2
    style HandleNetwork fill:#ffcdd2
```

---

## Frontend State Management

### Form Data Structure at Each Step

#### Initial State (Dialog Closed)

```javascript
{
  open: false,
  currentStep: 0,
  formData: {
    type: null,
    name: "",
    mainBranch: "main",
    visibility: "private",
    folderId: ""
  }
}
```

#### Step 1 (Type Selected)

```javascript
{
  open: true,
  currentStep: 0,
  formData: {
    type: "assessment",    // ✓ CHANGED
    name: "",
    mainBranch: "main",
    visibility: "private",
    folderId: ""
  }
}
```

#### Step 2 (Configuration in Progress)

```javascript
{
  open: true,
  currentStep: 1,         // ✓ CHANGED
  formData: {
    type: "assessment",
    name: "Quiz 1",        // ✓ CHANGED (user input)
    mainBranch: "main",
    visibility: "private",
    folderId: "fld_abc123" // ✓ CHANGED (user selected)
  }
}
```

#### Step 2 (Ready to Submit)

```javascript
{
  open: true,
  currentStep: 1,
  formData: {
    type: "assessment",
    name: "Midterm Exam - Algebra",  // ✓ Valid (not empty)
    mainBranch: "main",
    visibility: "private",
    folderId: "fld_abc123"
  }
}
```

#### Submitting State

```javascript
{
  open: true,
  currentStep: 1,
  formData: { ... },
  isSubmitting: true  // ✓ Mutation in progress
}
```

#### After Success

```javascript
{
  open: false,     // ✓ Modal closed
  currentStep: 0,  // ✓ Reset
  formData: {      // ✓ Reset to defaults
    type: null,
    name: "",
    mainBranch: "main",
    visibility: "private",
    folderId: ""
  }
}
// + Navigation to /authoring/compose/{lessonId}
```

---

## API Payload Transformation

### What Frontend Sends

```typescript
// TypeScript type from frontend
type CreateLessonFormData = {
  type: "assessment" | "lesson" | "puzzle-game" | "custom-game" | null;
  name: string;
  mainBranch: string;
  visibility: "public" | "private";
  folderId: string; // Empty string for root folder
};

// Example instance
const formData: CreateLessonFormData = {
  type: "assessment",
  name: "  Quiz 1  ", // May have whitespace
  mainBranch: "main",
  visibility: "private",
  folderId: "", // Empty = root folder
};
```

### What API Receives (After Transformation)

```json
POST /service/v1/lessons
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "type": "assessment",
  "name": "Quiz 1",          // ✓ Trimmed whitespace
  "mainBranch": "main",
  "visibility": "private",
  "folderId": null           // ✓ Converted empty string to null/undefined
}

// Note: authorId and organizationId extracted from JWT by backend
```

### What Backend Stores in Database

```sql
INSERT INTO lessons (
  id,                    -- Generated: "lesson_9x8y7z6"
  type,                  -- From request: "assessment"
  name,                  -- From request: "Quiz 1"
  slug,                  -- Generated: "quiz-1"
  main_branch,           -- From request: "main"
  visibility,            -- From request: "private"
  folder_id,             -- From request: NULL (root)
  author_id,             -- From JWT: "user_xyz789"
  organization_id,       -- From JWT: "org_school456"
  status,                -- Default: "draft"
  created_at,            -- Auto: "2025-12-07T10:30:00Z"
  updated_at             -- Auto: "2025-12-07T10:30:00Z"
) VALUES (...);

-- Also insert into lesson_versions:
INSERT INTO lesson_versions (
  id,                    -- Generated: "ver_initial_001"
  lesson_id,             -- FK: "lesson_9x8y7z6"
  version_number,        -- Auto: 1
  name,                  -- Default: "Initial version"
  status,                -- Default: "draft"
  created_by,            -- From JWT: "user_xyz789"
  created_at             -- Auto: "2025-12-07T10:30:00Z"
) VALUES (...);
```

---

## Summary: Key Integration Points

### 1️⃣ **Folder Loading** (Pre-Creation)

- **When**: Modal Step 2 opens
- **Endpoint**: `GET /service/v1/folders?organizationId={orgId}`
- **Frontend**: Populates dropdown with folders
- **Backend**: Returns folders user has access to

### 2️⃣ **Lesson Creation** (Main Action)

- **When**: User clicks "Create" button
- **Endpoint**: `POST /service/v1/lessons`
- **Frontend**: Sends validated form data
- **Backend**: Creates lesson + initial version, returns lesson ID

### 3️⃣ **Navigation** (Post-Creation)

- **When**: API returns success
- **Target**: `/authoring/compose/{lessonId}`
- **Frontend**: Navigates with lesson ID in URL
- **Backend**: Must support `GET /service/v1/lessons/{lessonId}` for compose page

### 4️⃣ **Error Handling** (Throughout)

- **Frontend**: Shows toasts, keeps modal open for retries
- **Backend**: Returns structured errors with field-level details
- **Pattern**: Follows envelope format `{ success, message, errorCode, errors[] }`

---

## Next Steps for Backend Team

1. **Review** this document alongside [lesson-creation-api-spec.md](./lesson-creation-api-spec.md)
2. **Ask Questions** in #bravo-authoring channel
3. **Implement** endpoints following the spec
4. **Update** OpenAPI documentation
5. **Notify Frontend** when APIs are ready for integration testing

**Questions?** Tag @frontend-team in Slack or comment on the Jira epic.
