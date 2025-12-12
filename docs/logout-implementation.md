# Logout Implementation Documentation

## Overview

This document describes the complete logout flow implementation for the Bravo Education platform.

## Implementation Date

January 2025

## Architecture

### Backend (NestJS)

**Endpoint**: `POST /authentication/logout`

- **Controller**: `authentication.controller.ts`
- **Service**: `authentication.service.ts`
- **Authentication**: Requires valid JWT Bearer token in Authorization header
- **Response**: `BaseResponseDto(true, 'Logged out successfully')`

**Functionality**:

1. Extracts user ID from JWT token
2. Calls `authenticationService.logout(userId)`
3. Revokes/invalidates refresh token in database
4. Returns success message

### Frontend (React + TypeScript)

#### 1. Auth API Layer (`domains/auth/apis/index.ts`)

```typescript
export const logoutApi = async (): Promise<TReponse<{ message: string }>> => {
  try {
    const response = await authInstance.post("/authentication/logout");
    return response.data;
  } catch (error) {
    // Even if API call fails, we still want to clear local tokens
    console.warn("Logout API call failed:", error);
    return {
      body: { message: "Logged out locally" },
    };
  }
};
```

**Features**:

- Uses `authInstance` (automatically includes Authorization header)
- Graceful degradation: If backend call fails, still returns success
- Allows local logout even if network is down

#### 2. Auth Store (`domains/auth/storage/index.ts`)

```typescript
type TAuthStore = TStorageUserData & {
  // ... other methods
  logout: () => void;
};

logout: () =>
  set(() => ({
    id: "",
    fullname: "",
    email: "",
    jobTitle: "",
    country: "",
    accessToken: "",
    refreshToken: "",
    username: "",
  }));
```

**Features**:

- Clears all user data from Zustand store
- Resets all fields to empty strings
- Immediate state update

#### 3. Axios Helper (`shared/lib/axios/index.ts`)

```typescript
export function logout(reason?: string) {
  clearTokens();
  window.dispatchEvent(
    new CustomEvent("auth:logout", {
      detail: { reason },
    })
  );
  window.location.href = "/login";
}
```

**Features**:

- Clears tokens from localStorage
- Dispatches custom event for other components to cleanup
- Redirects to login page
- Accepts optional reason parameter for logging

#### 4. UserMenu Component (`shared/components/user-menu/index.tsx`)

```typescript
const handleLogout = async () => {
  if (isLoggingOut) return;

  setIsLoggingOut(true);

  try {
    // 1. Call backend to revoke refresh token
    await logoutApi();

    // 2. Clear auth state in Zustand store
    clearAuthState();

    // 3. Clear tokens from localStorage and redirect
    axiosLogout("User logged out");
  } catch (error) {
    console.error("Error during logout:", error);
    // Even if API call fails, we still clear local state
    clearAuthState();
    axiosLogout("User logged out (with errors)");
  } finally {
    setIsLoggingOut(false);
  }
};
```

**Features**:

- Loading state management (`isLoggingOut`)
- Three-step logout flow
- Error handling with fallback
- UI feedback ("Logging out..." text)
- Disabled state during logout

## Logout Flow Sequence

```
User clicks "Log out" button
         ↓
1. Set isLoggingOut = true
         ↓
2. Call logoutApi() → POST /authentication/logout
         ↓
3. Backend revokes refresh token
         ↓
4. clearAuthState() → Reset Zustand store
         ↓
5. axiosLogout() → Clear localStorage + redirect to /login
         ↓
6. Set isLoggingOut = false (cleanup)
```

## Error Handling

### Backend Errors

- If backend call fails, frontend still proceeds with local logout
- Logs warning to console: "Logout API call failed"
- Returns mock success response to continue flow

### Network Errors

- Same as backend errors - graceful degradation
- User is logged out locally even if backend is unreachable
- Ensures user can always logout

### Already Logged Out

- If tokens are invalid, backend returns 401
- Axios interceptor catches this
- Still clears local state and redirects

## Security Features

1. **Refresh Token Revocation**: Backend invalidates refresh token in database
2. **Token Cleanup**: All tokens removed from localStorage
3. **State Reset**: Complete user state cleared from memory
4. **Immediate Redirect**: User sent to login page instantly
5. **Event Broadcasting**: Other components notified via `auth:logout` event

## UI/UX Features

1. **Loading State**: Button shows "Logging out..." during process
2. **Disabled State**: Button disabled during logout to prevent double-clicks
3. **Visual Feedback**: Button styling indicates loading state
4. **Error Recovery**: Always completes logout even on errors
5. **Instant Redirect**: No delay after logout completes

## Testing Checklist

- [ ] Successful logout clears all state
- [ ] Backend refresh token is revoked
- [ ] Redirect to /login works
- [ ] Cannot access protected routes after logout
- [ ] Can login again after logout
- [ ] Logout works when backend is down
- [ ] Logout works with expired tokens
- [ ] Loading state displays correctly
- [ ] Button is disabled during logout
- [ ] No console errors during normal logout
- [ ] Warning logged when backend call fails

## Future Enhancements

1. **React Query Cache Clearing**:

   ```typescript
   import { useQueryClient } from "@tanstack/react-query";
   const queryClient = useQueryClient();
   queryClient.clear(); // Clear all cached queries
   ```

2. **Toast Notifications**:

   ```typescript
   toast.success("You've been logged out successfully");
   ```

3. **Session History**:

   - Log logout events
   - Track logout reasons
   - Analytics integration

4. **Idle Timeout**:

   - Auto-logout after inactivity
   - Warning before auto-logout
   - Extend session option

5. **Logout Confirmation**:
   - Optional confirmation dialog
   - "Are you sure?" for unsaved changes
   - Remember choice preference

## Related Files

### Backend

- `bravo-learning-service/src/authentication/authentication.controller.ts`
- `bravo-learning-service/src/authentication/authentication.service.ts`

### Frontend

- `bravo-learning-system/src/domains/auth/apis/index.ts`
- `bravo-learning-system/src/domains/auth/storage/index.ts`
- `bravo-learning-system/src/shared/lib/axios/index.ts`
- `bravo-learning-system/src/shared/components/user-menu/index.tsx`

## API Reference

### Backend Endpoint

```
POST /authentication/logout
Authorization: Bearer <access_token>

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Frontend API Function

```typescript
logoutApi(): Promise<TReponse<{ message: string }>>
```

### Store Method

```typescript
logout(): void
```

### Axios Helper

```typescript
logout(reason?: string): void
```

## Notes

- The implementation prioritizes user experience over strict backend validation
- Local logout always succeeds, even if backend is unreachable
- This prevents users from being "stuck" in a logged-in state
- Refresh token revocation is best-effort, not required for frontend logout
- The `auth:logout` event allows for centralized cleanup across the application

## Changelog

### 2025-01-XX - Initial Implementation

- Added `logoutApi()` function in auth APIs
- Added `logout()` method to auth store
- Updated UserMenu component with complete logout flow
- Added loading state and error handling
- Created this documentation
