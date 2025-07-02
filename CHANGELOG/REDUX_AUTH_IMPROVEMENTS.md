# Redux Auth System - Improved Implementation

## Tổng quan

Hệ thống auth đã được cải thiện để tự động sync giữa NextAuth session và Redux state, loại bỏ việc phải manually manage auth state.

## Các thay đổi chính

### 1. AuthSlice được cải thiện
- ✅ Type safety với TypeScript
- ✅ Tự động sync với NextAuth  
- ✅ Persist chỉ các field cần thiết
- ✅ Loading states
- ✅ User profile management

### 2. Automatic Sync System
- ✅ `AuthProvider` component tự động sync NextAuth với Redux
- ✅ `useAuthSync` hook để manage sync logic
- ✅ Chỉ sync khi có thay đổi thực sự

### 3. Improved Hooks
- ✅ `useAuth()` - Primary hook để lấy user info
- ✅ `usePermissions()` - Check permissions & roles
- ✅ Helper functions cho common operations

## Cách sử dụng

### 1. Thay vì sử dụng NextAuth session trực tiếp:

```tsx
// ❌ Old way
import { useSession } from "next-auth/react";

function MyComponent() {
  const { data: session } = useSession();
  const user = session?.user;
  const isLoggedIn = !!session;
  
  return <div>{user?.name}</div>;
}
```

### 2. Sử dụng hooks mới:

```tsx
// ✅ New way
import { useAuth } from "@/hooks/auth";

function MyComponent() {
  const { user, isLoggedIn, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!isLoggedIn) return <div>Please login</div>;
  
  return <div>{user?.name}</div>;
}
```

### 3. Check permissions:

```tsx
import { usePermissions } from "@/hooks/auth";

function AdminPanel() {
  const { hasAdminAccess, isAdmin, checkPermission } = usePermissions();
  
  if (!hasAdminAccess()) {
    return <div>Access denied</div>;
  }
  
  return (
    <div>
      {isAdmin() && <AdminOnlyFeature />}
      {checkPermission("DELETE_POSTS") && <DeleteButton />}
    </div>
  );
}
```

### 4. Logout properly:

```tsx
import { signOut } from "next-auth/react";
import { useAppDispatch } from "@/store";
import { removeActiveUser } from "@/store/authSlice";

function LogoutButton() {
  const dispatch = useAppDispatch();
  
  const handleLogout = async () => {
    // Clear Redux state
    dispatch(removeActiveUser());
    
    // Clear NextAuth session
    await signOut({ redirect: true, callbackUrl: "/" });
  };
  
  return <button onClick={handleLogout}>Logout</button>;
}
```

## Benefits

1. **Single Source of Truth**: Redux store là primary source, tự động sync với NextAuth
2. **Type Safety**: Full TypeScript support với proper types
3. **Performance**: Chỉ re-render khi auth state thực sự thay đổi
4. **Persistence**: Auth state được persist an toàn
5. **Developer Experience**: Easier debugging và dev tools support
6. **Consistency**: Uniform API across the app

## Migration Guide

### Replace old auth calls:

```tsx
// ❌ Old
import { useSession } from "next-auth/react";
import { useAppSelector } from "@/store";

const { data: session } = useSession();
const authState = useAppSelector(state => state.authState);

// ✅ New  
import { useAuth } from "@/hooks/auth";

const { user, isLoggedIn, isAdmin } = useAuth();
```

### Update Redux actions:

```tsx
// ❌ Old
import { SET_ACTIVE_USER, REMOVE_ACTIVE_USER } from "@/store/authSlice";

dispatch(SET_ACTIVE_USER({ displayName: user.name }));
dispatch(REMOVE_ACTIVE_USER());

// ✅ New - Không cần manual dispatch, tự động sync!
// Hoặc nếu cần update profile:
import { updateUserProfile } from "@/store/authSlice";

dispatch(updateUserProfile({ name: newName }));
```

## File Structure

```
src/
├── hooks/
│   └── auth/
│       ├── index.ts          # Export all auth hooks
│       ├── useAuth.ts        # Main auth hook
│       └── useAuthSync.ts    # Auto-sync logic
├── store/
│   ├── authSlice.ts          # Improved auth slice
│   └── index.ts              # Store config with auth
└── components/
    └── AuthProvider.tsx      # Auto-sync provider
```

## Next Steps

1. ✅ Test the new auth system thoroughly
2. ✅ Update all components to use new hooks
3. ✅ Remove old auth-related code
4. ✅ Add error handling for auth failures
5. ✅ Add auth state persistence options
