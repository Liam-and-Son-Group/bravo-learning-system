# Bravo Learning System - SignUp Flow Documentation

> **⚠️ DEPRECATION NOTICE**  
> This document describes a **planned/legacy architecture** that is **NOT currently implemented**.  
> For the **actual implementation**, see: [`signup-flow-actual.md`](./signup-flow-actual.md)
>
> **Key Differences:**
>
> - This doc: 5 separate steps with individual API endpoints
> - Actual implementation: 4-step wizard with single combined endpoint `/authentication/signup`
> - Email verification: This doc shows it as a blocking step; actual implementation sends verification email after signup (non-blocking)

---

## Overview

The signup process for Bravo Learning System is designed to create a new educational organization account with proper user roles and permissions. The process is divided into multiple steps to ensure comprehensive data collection while maintaining a good user experience.

**NOTE**: This is a planned architecture for reference. The current system uses a simplified approach.

## 1. Initial Registration

### Step 1: User Account Creation

```typescript
// POST /api/auth/register
type TUserRegistrationPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
};

type TUserRegistrationResponse = {
  userId: string;
  email: string;
  verificationToken: string;
  expiresAt: string;
};
```

### Step 2: Email Verification

```typescript
// POST /api/auth/verify-email
type TEmailVerificationPayload = {
  email: string;
  token: string;
};

type TEmailVerificationResponse = {
  verified: boolean;
  userId: string;
};
```

## 2. Organization Creation

### Step 1: Organization Details

```typescript
// POST /api/organizations
type TOrganizationPayload = {
  organizationName: string;
  organizationType: "School" | "Private Center" | "University" | "Company";
  address: string;
  city: string;
  country: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  taxCode?: string;
  logo?: File;
};

type TOrganizationResponse = {
  organizationId: string;
  name: string;
  type: string;
  status: "active" | "pending" | "review";
  createdAt: string;
};
```

## 3. Member Invitation

### Step 1: Invite Team Members

```typescript
// POST /api/organizations/{orgId}/invitations
type TInvitationPayload = {
  // Email-based invitation
  emails?: string[];

  // Username-based invitation
  usernames?: string[];

  // Role assignment
  roleId: string;

  // Optional fields
  message?: string;
  expiresAt?: string;

  // For share link
  generateLink?: boolean;
  linkMaxUses?: number;
};

type TInvitationResponse = {
  invitationIds: string[];
  shareLink?: string;
  linkExpiresAt?: string;
  pendingInvites: number;
};
```

## 4. Workspace Setup

### Step 1: Initial Configuration

```typescript
// POST /api/organizations/{orgId}/workspace/setup
type TWorkspaceSetupPayload = {
  timezone: string;
  language: string;
  academicYear?: {
    start: string;
    end: string;
  };
  branding?: {
    primaryColor: string;
    logo: string;
  };
  modules: {
    courses: boolean;
    assignments: boolean;
    grading: boolean;
    attendance: boolean;
  };
};

type TWorkspaceSetupResponse = {
  workspaceId: string;
  status: "ready" | "configuring";
  features: string[];
  nextSteps: {
    action: string;
    url: string;
  }[];
};
```

## API Error Handling

```typescript
type TApiError = {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
};

// Common Error Codes
const ERROR_CODES = {
  INVALID_INPUT: "INVALID_INPUT",
  EMAIL_EXISTS: "EMAIL_EXISTS",
  INVALID_TOKEN: "INVALID_TOKEN",
  ORG_NAME_TAKEN: "ORG_NAME_TAKEN",
  INVITATION_LIMIT: "INVITATION_LIMIT",
  PERMISSION_DENIED: "PERMISSION_DENIED",
} as const;
```

## Frontend State Management

```typescript
// Signup Progress State
type TSignupProgress = {
  currentStep:
    | "registration"
    | "verification"
    | "organization"
    | "invitation"
    | "workspace";
  completed: string[];
  userId?: string;
  organizationId?: string;
  workspaceId?: string;
  token?: string;
};

// Store this in your state management solution (e.g., Zustand)
type TSignupStore = {
  progress: TSignupProgress;
  updateProgress: (progress: Partial<TSignupProgress>) => void;
  resetProgress: () => void;
};
```

## Success Scenarios

1. Complete Flow:

```typescript
Registration → Email Verification → Organization Creation → Member Invitation → Workspace Setup

Expected Time: ~5-10 minutes
```

2. Minimal Flow:

```typescript
Registration → Email Verification → Organization Creation → Workspace Setup

Expected Time: ~3-5 minutes
```

## Error Scenarios

1. Registration Failures:

- Email already exists
- Invalid email format
- Weak password
- Rate limiting

2. Organization Creation Failures:

- Name already taken
- Invalid tax information
- File upload failures

3. Invitation Failures:

- Invalid emails
- Rate limiting
- Permission issues

## Security Considerations

1. Rate Limiting:

```typescript
{
  "registration": "10 attempts per hour",
  "email-verification": "5 attempts per hour",
  "invitation": "50 invites per day"
}
```

2. Data Validation:

- Email format verification
- Phone number format validation
- Tax ID verification
- File type/size validation

3. Authentication:

- Token-based authentication
- Session management
- Permission checks
