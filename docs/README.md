# Bravo Learning System - Documentation Index

📚 **Complete documentation hub for developers, backend team, and stakeholders**

---

## 📖 Documentation Structure

```
docs/
├── README.md                              # 👈 You are here
├── PROJECT_INTRODUCTION.md                # Project overview & business logic
├── signup-flow.md                         # User registration flow (LEGACY - planned architecture)
├── signup-flow-actual.md                  # 🆕 User registration flow (ACTUAL IMPLEMENTATION)
├── openapi-working-desk-versioning.yaml   # API schema for versioning
├── lesson-creation-api-spec.md            # 🆕 Lesson creation API specification
├── lesson-creation-flow-diagrams.md       # 🆕 Visual flow diagrams
├── lesson-creation-quick-reference.md     # 🆕 Quick reference for backend
├── lesson-creation-payload-examples.md    # 🆕 Real-world payload examples
├── BACKEND_IMPLEMENTATION_GUIDE.md        # 🆕 Step-by-step backend guide
└── lesson-creation-feature.md             # 🆕 Frontend implementation details
```

---

## 🚀 Quick Navigation

### For Backend Developers

**Need to implement Lesson Creation APIs?**

1. **Start here**: [Quick Reference](./lesson-creation-quick-reference.md) ⚡

   - TL;DR version with essential info
   - Field specs, validation rules, error codes
   - Example requests/responses
   - Quick database schemas

2. **Then read**: [API Specification](./lesson-creation-api-spec.md) 📋

   - Complete endpoint documentation
   - Detailed validation rules
   - Error handling scenarios
   - Integration examples

3. **Visual learner?**: [Flow Diagrams](./lesson-creation-flow-diagrams.md) 🎨
   - Mermaid diagrams for user flows
   - Sequence diagrams for API calls
   - State transition diagrams
   - Error flow handling

### For Frontend Developers

**Working on Lesson Creation UI?**

1. **Implementation details**: [Feature Documentation](./lesson-creation-feature.md) 💻

   - Component structure
   - State management
   - UI/UX patterns
   - Testing checklist

2. **API integration**: [API Specification](./lesson-creation-api-spec.md) 📋
   - Request/response formats
   - Error handling
   - Frontend code examples

### For Product/Business Team

**Understanding the system?**

1. **Project Overview**: [PROJECT_INTRODUCTION](./PROJECT_INTRODUCTION.md) 🎯

   - Business vision and value proposition
   - Core capabilities and personas
   - Domain logic and workflows
   - Technical architecture overview

2. **User Flows**: [Flow Diagrams](./lesson-creation-flow-diagrams.md) 🎨
   - Visual representation of features
   - User journey diagrams
   - State transitions

---

## 📚 Feature Documentation

### 🆕 Lesson Creation Feature (December 2025)

A comprehensive multi-step modal for creating educational content (assessments, lessons, games).

| Document                                                | Purpose                                   | Audience           | Time to Read |
| ------------------------------------------------------- | ----------------------------------------- | ------------------ | ------------ |
| [Quick Reference](./lesson-creation-quick-reference.md) | Essential info for backend implementation | Backend devs       | 5 min ⚡     |
| [API Specification](./lesson-creation-api-spec.md)      | Complete API documentation                | Backend & Frontend | 15 min 📋    |
| [Flow Diagrams](./lesson-creation-flow-diagrams.md)     | Visual flows and sequences                | All teams          | 10 min 🎨    |
| [Feature Implementation](./lesson-creation-feature.md)  | Frontend component details                | Frontend devs      | 10 min 💻    |

**Key APIs Required**:

- `POST /service/v1/lessons` - Create new lesson
- `GET /service/v1/folders` - List folders for organization
- `GET /service/v1/lessons/{id}` - Get lesson details

**Implementation Status**:

- ✅ Frontend UI completed
- ✅ Multi-step modal with Stepper
- ✅ Type selection (4 types)
- ✅ Configuration form
- ⏳ Backend API pending
- ⏳ Integration pending

---

### 🔐 Authentication & Organization Setup

#### User Signup Flow (December 2025)

| Document                                            | Purpose                                     | Status              | Time to Read |
| --------------------------------------------------- | ------------------------------------------- | ------------------- | ------------ |
| [signup-flow-actual.md](./signup-flow-actual.md) ✅ | **ACTUAL** implementation (single endpoint) | Current             | 10 min 📋    |
| [signup-flow.md](./signup-flow.md) ⚠️               | Planned/legacy architecture (multi-step)    | Deprecated/Not used | Reference    |

**Current Implementation** (signup-flow-actual.md):

- 4-step wizard: Account → Organization → Invite Members → Done
- Single combined API: `POST /authentication/signup`
- Email verification sent asynchronously (non-blocking)
- Atomic transaction (all-or-nothing)

**Legacy/Planned** (signup-flow.md):

- 5-step process with individual API calls
- Blocking email verification step
- **NOT CURRENTLY IMPLEMENTED** - kept for reference

**Key Features**:

- User registration with organization creation
- Avatar upload with crop/zoom
- Role assignment (owner, admin, teacher, student)
- Team member invitations
- JWT token authentication with refresh

**Related Documentation**:

- [PROJECT_INTRODUCTION.md](./PROJECT_INTRODUCTION.md#key-business-flows) - Authentication flow diagrams

---

### 🗂️ Working Desk & Versioning

| Document                                                                       | Purpose                                                    |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------- |
| [openapi-working-desk-versioning.yaml](./openapi-working-desk-versioning.yaml) | API schema for collaborative authoring and version control |

**Key Concepts**:

- Working desks (collaborative workspaces)
- Version management (draft, published, archived)
- Activity tracking
- Publishing workflow

---

## 🏗️ System Architecture

### Technology Stack

**Frontend**:

- ⚛️ React 19 + TypeScript 5
- ⚡ Vite 7 for build tooling
- 🎨 Tailwind CSS + shadcn/ui components
- 🔄 TanStack Router for routing
- 📊 TanStack Query for data fetching
- 🐻 Zustand for state management

**Backend** (Expected):

- Node.js/Express or similar
- PostgreSQL/MySQL database
- JWT authentication
- RESTful API design

**Architecture Pattern**:

- Domain-driven design (DDD)
- Vertical slice architecture
- Clean separation of concerns
- Type-safe contracts

### Domain Structure

```
src/domains/
├── auth/           # Authentication & user management
├── classroom/      # Classroom management
├── organization/   # Organization settings
├── authoring/      # Content creation (lessons, assessments)
├── course/         # Course management
└── user/           # User profiles
```

---

## 🎯 Domain Documentation

### Auth Domain

**Purpose**: User authentication, signup, login, token management

**Key Features**:

- Multi-step signup with organization creation
- JWT token refresh mechanism
- Role-based access control
- User profile management

**Documentation**: See [signup-flow.md](./signup-flow.md)

---

### Organization Domain

**Purpose**: Manage organization settings and members

**Key Features**:

- Organization detail view
- Member management with roles
- Organization metadata (logo, address, compliance info)
- Shared hook: `useCurrentUser` for accessing user + org data

**Documentation**: See [PROJECT_INTRODUCTION.md](./PROJECT_INTRODUCTION.md#organization-domain)

---

### Authoring Domain

**Purpose**: Create and manage educational content

**Key Features**:

- ✅ Lesson creation modal (multi-step)
- ✅ Type selection (assessment, lesson, puzzle-game, custom-game)
- ✅ Configuration (name, branch, visibility, folder)
- ⏳ Content composition (pending)
- ⏳ Version management (pending)

**Documentation**:

- [Feature Implementation](./lesson-creation-feature.md)
- [API Specification](./lesson-creation-api-spec.md)

---

### Classroom Domain

**Purpose**: Manage classrooms and student enrollment

**Key Features**:

- Classroom creation
- Student enrollment (via key or invitation)
- Classroom details and roster
- Learning space management

**Documentation**: See [PROJECT_INTRODUCTION.md](./PROJECT_INTRODUCTION.md#classroom-domain)

---

## 🔄 Key Business Flows

### 1. User Onboarding

```
Signup → Email Verification → Organization Creation → Setup Complete → Dashboard
```

**Documentation**: [signup-flow.md](./signup-flow.md)

---

### 2. Lesson Creation

```
Authoring Page → Create Button → Type Selection → Configuration → API Call → Navigate to Compose
```

**Documentation**: [Flow Diagrams](./lesson-creation-flow-diagrams.md)

---

### 3. Classroom Setup

```
Admin Dashboard → Create Classroom → Set Details → Generate Key → Invite Students → Classroom Active
```

**Documentation**: [PROJECT_INTRODUCTION.md](./PROJECT_INTRODUCTION.md#classroom-flow)

---

## 🛠️ Development Guidelines

### For New Developers

**1. Start Here**:

- Read [PROJECT_INTRODUCTION.md](./PROJECT_INTRODUCTION.md) for business context
- Understand domain-driven architecture
- Review existing domain patterns

**2. Working on Features**:

- Check if feature documentation exists in `docs/`
- Follow existing patterns (see similar domains)
- Update documentation when adding new features

**3. API Integration**:

- Review API specs in `docs/`
- Use `authInstance` from `src/shared/lib/axios`
- Follow TanStack Query patterns for data fetching
- Add query keys in domain `queries/` folder

**4. Component Development**:

- Use shadcn/ui components from `src/shared/components/ui`
- Follow TypeScript strict mode
- Keep components small and focused
- Separate presentation from business logic

---

### For Backend Developers

**Implementing APIs**:

1. **Find the Spec**: Check `docs/` for API specification
2. **Review Quick Reference**: Start with quick reference document
3. **Check Flow Diagrams**: Understand user journey
4. **Follow Response Format**: Use standard envelope pattern:
   ```json
   {
     "success": true,
     "message": "OK",
     "data": { ... }
   }
   ```
5. **Error Handling**: Return structured errors:
   ```json
   {
     "success": false,
     "message": "Error message",
     "errorCode": "ERROR_CODE",
     "errors": [{ "field": "name", "message": "..." }]
   }
   ```

**Need Help?**

- Check existing API docs: [openapi-working-desk-versioning.yaml](./openapi-working-desk-versioning.yaml)
- Review authentication patterns in PROJECT_INTRODUCTION
- Ask in #bravo-backend Slack channel

---

## 📊 Documentation Standards

### Creating New Documentation

When adding new features, create documentation following this structure:

1. **Quick Reference** (for backend devs)

   - 1-page summary
   - Essential fields and validation
   - Example request/response
   - Error codes

2. **API Specification** (detailed)

   - Complete endpoint documentation
   - Request/response schemas
   - Validation rules
   - Error handling
   - Integration examples

3. **Flow Diagrams** (visual)

   - Mermaid diagrams
   - User journey
   - Sequence diagrams
   - State machines

4. **Feature Documentation** (for frontend)
   - Component structure
   - State management
   - UI/UX details
   - Testing checklist

### Documentation Checklist

- [ ] Title and purpose clear
- [ ] Table of contents for long docs
- [ ] Code examples with syntax highlighting
- [ ] Request/response examples
- [ ] Error scenarios covered
- [ ] Visual diagrams included
- [ ] Links to related documentation
- [ ] Last updated date
- [ ] Contact/support information

---

## 🤝 Contributing

### Updating Documentation

1. **Keep It Current**: Update docs when code changes
2. **Use Examples**: Real-world examples over abstract descriptions
3. **Be Visual**: Add diagrams for complex flows
4. **Cross-Link**: Reference related documentation
5. **Test Examples**: Ensure code samples work

### Documentation Review Process

1. Create documentation alongside feature implementation
2. Review with team before merging
3. Get sign-off from backend team for API specs
4. Update index (this README) with new docs

---

## 📞 Support & Contact

### Need Help?

**For Feature Documentation**:

- Check this index first
- Search in `docs/` folder
- Ask in #bravo-dev Slack channel

**For API Specifications**:

- Review quick reference first
- Check full API spec
- Contact backend team in #bravo-backend

**For Business Logic**:

- Read PROJECT_INTRODUCTION.md
- Review flow diagrams
- Ask product team in #bravo-product

### Slack Channels

- **#bravo-dev**: General development
- **#bravo-backend**: Backend API questions
- **#bravo-frontend**: Frontend implementation
- **#bravo-authoring**: Lesson creation feature
- **#bravo-product**: Business logic and requirements

---

## 📅 Document History

| Date        | Document                | Change                                      | Author        |
| ----------- | ----------------------- | ------------------------------------------- | ------------- |
| Dec 7, 2025 | lesson-creation-\*      | Created lesson creation documentation suite | Frontend Team |
| Nov 2025    | PROJECT_INTRODUCTION.md | Initial project documentation               | Frontend Team |
| Nov 2025    | signup-flow.md          | User signup flow documentation              | Frontend Team |

---

## 🔗 External Resources

- **Design System**: Shadcn UI - https://ui.shadcn.com
- **Router Docs**: TanStack Router - https://tanstack.com/router
- **Query Docs**: TanStack Query - https://tanstack.com/query
- **Mermaid Diagrams**: https://mermaid.js.org

---

<div align="center">
  <p><strong>Bravo Learning System</strong></p>
  <p><em>Building the future of education, one feature at a time</em></p>
  <p>Made with ❤️ by the Bravo Team</p>
</div>
