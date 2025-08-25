# Admin Authentication System Documentation

## Overview

This document describes the improved authentication system for the JeanPay Admin Panel. The system uses cookie-based authentication with automatic token refresh, admin privilege verification, and centralized error handling.

## Architecture

### Components

1. **Axios Client with Interceptors** (`/lib/axios.ts`)
2. **Authentication Context** (`/components/contexts/UserAuthContext.tsx`)
3. **Auth Initialization Provider** (`/components/providers/InitializeAuth.tsx`)
4. **Authentication Functions** (`/data/funcs/auth/AuthFuncs.ts`)

### Key Features

- **Cookie-based Authentication**: Uses `withCredentials: true` for automatic cookie handling
- **Automatic Token Refresh**: Seamless token refresh on 401 errors
- **Request Queuing**: Handles concurrent requests during token refresh
- **Admin Privilege Verification**: Ensures only admin users can access the panel
- **Centralized Error Handling**: Consistent auth error handling across the app
- **Route Protection**: Automatic redirection for protected routes

## Admin-Specific Features

### Admin Privilege Check

The system specifically verifies that authenticated users have admin privileges:

```typescript
// Check if user is admin
if (!userData.is_admin) {
  throw new Error("Access denied: Admin privileges required");
}
```

### Access Denied Screen

Non-admin users see a dedicated access denied screen with logout option:

```typescript
if (authState.isAuthenticated && !authState.user?.is_admin) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-4">
          You don't have admin privileges to access this area.
        </p>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
```

## How It Works

### 1. Axios Client Setup

The axios client is configured with admin-specific settings:

```typescript
const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
```

### 2. Token Refresh Flow

When a request receives a 401 response:

1. **Check if refresh is needed**: Verify it's not already refreshing and not a refresh endpoint
2. **Queue concurrent requests**: Store any concurrent requests in a queue
3. **Attempt token refresh**: Call the refresh token endpoint
4. **Process queue**: Either retry all queued requests or reject them
5. **Handle failure**: Emit logout event if refresh fails

### 3. Authentication Context

Manages global authentication state with admin verification:

```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

Key methods:
- `initializeAuth()`: Initialize auth state with admin check
- `logout()`: Clear auth state and redirect to login
- `updateUser()`: Update user information
- `refreshUser()`: Refresh user data from server

### 4. Event-Driven Communication

The system uses custom events for communication between axios interceptors and the auth context:

```typescript
// Axios interceptor emits logout event
window.dispatchEvent(new CustomEvent("auth:logout"));

// Auth context listens for the event
window.addEventListener("auth:logout", handleAuthLogout);
```

## Usage

### Setup in App Layout

```tsx
import { AuthProvider } from "@/components/contexts/UserAuthContext";
import InitializeAuthProvider from "@/components/providers/InitializeAuth";

export default function Layout({ children }) {
  return (
    <AuthProvider>
      <InitializeAuthProvider>
        {children}
      </InitializeAuthProvider>
    </AuthProvider>
  );
}
```

### Using Auth Context

```tsx
import { useAuthContext } from "@/components/contexts/UserAuthContext";

function AdminComponent() {
  const { user, isAuthenticated, logout } = useAuthContext();

  if (!isAuthenticated || !user?.is_admin) {
    return <div>Access denied</div>;
  }

  return (
    <div>
      <h1>Welcome Admin, {user?.first_name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making API Calls

```typescript
import axiosClient from "@/lib/axios";

// The axios client automatically handles auth headers and token refresh
const response = await axiosClient.get("/admin/users");
```

## Route Protection

### Public Routes

Routes that don't require authentication:
- `/login`

### Protected Routes

All other routes require authentication AND admin privileges. Users will be:
1. Redirected to `/login` if not authenticated
2. Shown access denied screen if authenticated but not admin

### Route Handling Logic

1. **InitializeAuthProvider** checks route type and auth status
2. **AuthContext** handles redirects for unauthenticated users
3. **AuthContext** shows access denied for non-admin users
4. **Login page** redirects authenticated users to dashboard

## Error Handling

### Authentication Errors

- **401 Unauthorized**: Automatically triggers token refresh
- **Token refresh failure**: Logs out user and redirects to login
- **Admin privilege denied**: Shows access denied screen
- **Network errors**: Preserves error for component handling

### Error Flow

1. API request fails with 401
2. Axios interceptor catches error
3. Attempts token refresh
4. On success: retries original request
5. On failure: emits logout event
6. Auth context handles logout and redirect

## Security Considerations

### Admin-Specific Security

- **Privilege Verification**: Double-checks admin status on every auth validation
- **Access Control**: Prevents non-admin access at multiple levels
- **Secure Logout**: Clears all auth state on privilege denial

### Cookie Security

- Cookies are HTTP-only and secure
- `withCredentials: true` ensures cookies are sent with requests
- Automatic cookie handling prevents XSS token theft

### Request Security

- No tokens stored in localStorage or sessionStorage
- Automatic token refresh prevents expired token issues
- Request queuing prevents race conditions

## Best Practices

### Admin Route Protection

✅ **Do:**
```typescript
// Always check admin status in components
const { user, isAuthenticated } = useAuthContext();
if (!isAuthenticated || !user?.is_admin) {
  return <AccessDenied />;
}
```

❌ **Don't:**
```typescript
// Don't rely on client-side admin checks alone
if (user?.is_admin) {
  // This should be verified server-side too
}
```

### Making API Calls

✅ **Do:**
```typescript
// Use the configured axios client
import axiosClient from "@/lib/axios";
const response = await axiosClient.get("/admin/data");
```

❌ **Don't:**
```typescript
// Don't use fetch or other HTTP clients for authenticated requests
const response = await fetch("/admin/data");
```

### Error Handling

✅ **Do:**
```typescript
try {
  const response = await axiosClient.get("/admin/data");
  return response.data;
} catch (error) {
  // Handle specific business logic errors
  if (error.response?.status === 403) {
    // Handle forbidden access
  }
  throw error; // Let auth errors be handled by interceptor
}
```

❌ **Don't:**
```typescript
// Don't handle 401 errors manually
if (error.response?.status === 401) {
  // This will conflict with the interceptor
  window.location.href = "/login";
}
```

## Troubleshooting

### Common Issues

1. **Access denied for admin users**: Check server-side admin flag and database
2. **Infinite redirect loops**: Check public route configuration
3. **Token not refreshing**: Verify cookie configuration and API endpoints
4. **Concurrent request failures**: Check request queuing implementation

### Debugging

Enable debug logging:
```typescript
// Add to axios interceptor for debugging
console.log("Admin request config:", config);
console.log("Admin response:", response);
console.log("Admin auth error:", error);
```

### Testing Admin Auth Flow

1. **Login as admin**: Verify admin user can access dashboard
2. **Login as regular user**: Verify access denied screen shows
3. **Token refresh**: Wait for token expiry and verify automatic refresh
4. **Logout**: Verify state cleanup and redirect to login
5. **Route protection**: Try accessing admin routes without auth

## Migration Guide

### From Previous Implementation

If migrating from the previous auth system:

1. **Remove localStorage token handling**:
   ```typescript
   // Remove these lines
   localStorage.getItem("authToken");
   localStorage.setItem("authToken", token);
   ```

2. **Update API calls to use axiosClient**:
   ```typescript
   // Replace fetch calls
   const response = await axiosClient.get("/admin/endpoint");
   ```

3. **Remove manual token refresh logic**:
   ```typescript
   // Remove manual refresh calls
   await refreshToken();
   ```

4. **Add admin privilege checks**:
   ```typescript
   // Add admin verification in components
   if (!user?.is_admin) return <AccessDenied />;
   ```

## API Endpoints

The admin auth system expects these API endpoints:

- `POST /auth/login` - Admin user login
- `POST /auth/logout` - Admin user logout  
- `POST /auth/register` - Admin user registration (if applicable)
- `POST /auth/refresh-token` - Token refresh
- `POST /protected/user/retrieve` - Get current user with admin flag

## Configuration

### Environment Variables

```env
NEXT_PUBLIC_API_URL=https://admin-api.jeanpay.com
```

### Admin User Requirements

Users must have the following properties to access admin panel:
- `is_admin: true` - Admin privilege flag
- Valid authentication session
- Active user account (`is_blocked: false`)

## Performance Considerations

- **Request queuing** prevents multiple refresh attempts
- **Event-driven communication** reduces coupling
- **Cookie-based auth** reduces client-side storage overhead
- **Automatic retry** improves admin user experience
- **Admin privilege caching** reduces server requests

## Security Compliance

- ✅ **OWASP**: Follows secure authentication practices
- ✅ **CSRF Protection**: Cookie-based auth with proper headers
- ✅ **XSS Prevention**: No token storage in localStorage
- ✅ **Session Management**: Automatic token refresh and logout
- ✅ **Privilege Escalation**: Prevents non-admin access
- ✅ **Access Control**: Multi-layer admin verification