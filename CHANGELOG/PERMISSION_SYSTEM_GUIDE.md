# 🔐 Hướng dẫn sử dụng Hệ thống Phân quyền nâng cao

## Tổng quan

Dự án đã được cập nhật với hệ thống phân quyền nâng cao, cung cấp kiểm soát quyền truy cập chi tiết theo **Resource → Action → Level**.

## 🏗️ Cấu trúc hệ thống

### 1. **Resources (Tài nguyên)**
```typescript
RESOURCES = {
  USERS: 'users',
  PRODUCTS: 'products', 
  ORDERS: 'orders',
  CATEGORIES: 'categories',
  POSTS: 'posts',
  PAGES: 'pages',
  FILES: 'files',
  ATTRIBUTES: 'attributes',
  CUSTOMERS: 'customers',
  SETTINGS: 'settings',
  REPORTS: 'reports',
  ANALYTICS: 'analytics'
}
```

### 2. **Actions (Hành động)**
```typescript
ACTIONS = {
  CREATE: 'create',
  READ: 'read', 
  UPDATE: 'update',
  DELETE: 'delete',
  EXPORT: 'export',
  IMPORT: 'import',
  BULK_DELETE: 'bulk_delete',
  BULK_UPDATE: 'bulk_update',
  APPROVE: 'approve',
  REJECT: 'reject',
  PUBLISH: 'publish',
  UNPUBLISH: 'unpublish'
}
```

### 3. **Permission Levels (Mức độ quyền hạn)**
```typescript
PERMISSION_LEVELS = {
  NONE: 0,    // Không có quyền
  READ: 1,    // Chỉ xem
  WRITE: 2,   // Xem + Chỉnh sửa
  ADMIN: 3,   // Toàn quyền trên resource
  OWNER: 4    // Quyền sở hữu
}
```

### 4. **User Roles (Vai trò)**
```typescript
Roles: 'ADMIN' | 'MODERATOR' | 'USER'

// Default permissions theo role:
ADMIN: Toàn quyền tất cả resources
MODERATOR: WRITE trên hầu hết resources, READ trên USERS/SETTINGS
USER: READ trên các resources công khai
```

## 🚀 Cách sử dụng

### 1. **API Routes - Server Side**

```typescript
import { withUsersPermission } from "@/lib/auth-middleware";
import { ACTIONS, PERMISSION_LEVELS } from "@/lib/permissions";

// Kiểm tra quyền READ users
export const GET = withUsersPermission(ACTIONS.READ)(async (req: NextRequest) => {
  // Logic xử lý
});

// Kiểm tra quyền WRITE users  
export const POST = withUsersPermission(ACTIONS.CREATE, PERMISSION_LEVELS.WRITE)(async (req: NextRequest) => {
  // Logic tạo user
});

// Các middleware có sẵn:
withUsersPermission()
withProductsPermission()
withOrdersPermission()
withCategoriesPermission()
withPostsPermission()
withFilesPermission()
withCustomersPermission()
withSettingsPermission()

// Middleware đặc biệt:
requireAdmin()           // Chỉ ADMIN
requireModerator()       // MODERATOR hoặc ADMIN
requireOwnerOrAdmin()    // Owner của resource hoặc ADMIN
```

### 2. **Admin Pages - Server Side**

```typescript
import { createPermissionChecker, RESOURCES, ACTIONS, PERMISSION_LEVELS } from "@/lib/permissions";

export default async function AdminUsersPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/authentication/login");
  }

  const userContext = {
    userId: session.user.id as string,
    role: session.user.role as 'ADMIN' | 'MODERATOR' | 'USER',
    customPermissions: session.user.permissions ? 
      JSON.parse(session.user.permissions) : undefined
  };

  const permissionChecker = createPermissionChecker(userContext);

  // Kiểm tra quyền truy cập
  if (!permissionChecker.hasPermission(RESOURCES.USERS, ACTIONS.READ)) {
    redirect("/admin/deny");
  }

  return <UsersManagementComponent />;
}
```

### 3. **Client Components - Permission Gates**

```tsx
import { PermissionGate, AdminOnly, CanEditUsers } from "@/components/permissions/PermissionGate";

function UsersList() {
  return (
    <div>
      {/* Hiển thị cho users có quyền xem */}
      <PermissionGate 
        resource={RESOURCES.USERS} 
        action={ACTIONS.READ}
        fallback={<div>Bạn không có quyền xem danh sách users</div>}
      >
        <UsersTable />
      </PermissionGate>

      {/* Hiển thị nút chỉ cho admin */}
      <AdminOnly fallback={null}>
        <button>Delete All Users</button>
      </AdminOnly>

      {/* Kiểm tra quyền edit users */}
      <CanEditUsers>
        <EditUserButton />
      </CanEditUsers>

      {/* Kiểm tra ownership */}
      <PermissionGate 
        resource={RESOURCES.POSTS} 
        action={ACTIONS.UPDATE}
        requireOwnership={true}
        resourceOwnerId={post.userId}
        fallback={<div>Bạn chỉ có thể chỉnh sửa bài viết của mình</div>}
      >
        <EditPostButton />
      </PermissionGate>
    </div>
  );
}
```

### 4. **Permission Hook**

```tsx
import { usePermissions } from "@/components/permissions/PermissionGate";

function MyComponent() {
  const permissionChecker = usePermissions();

  if (!permissionChecker) {
    return <div>Chưa đăng nhập</div>;
  }

  const canCreateProducts = permissionChecker.hasPermission(
    RESOURCES.PRODUCTS, 
    ACTIONS.CREATE, 
    PERMISSION_LEVELS.WRITE
  );

  const isAdmin = permissionChecker.isAdmin();
  const isModerator = permissionChecker.isModerator();

  return (
    <div>
      {canCreateProducts && <CreateProductButton />}
      {isAdmin && <AdminPanel />}
      {isModerator && <ModeratorTools />}
    </div>
  );
}
```

## 🛡️ Bảo mật nâng cao

### 1. **Route Protection tự động**
File `/src/lib/admin-route-protection.ts` cung cấp middleware tự động bảo vệ admin routes:

```typescript
// Trong middleware.ts có thể thêm:
import { checkAdminRoutePermission } from "@/lib/admin-route-protection";

export default auth(async (req) => {
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const permissionCheck = await checkAdminRoutePermission(req);
    
    if (!permissionCheck.allowed) {
      return NextResponse.redirect(new URL(permissionCheck.redirectTo!, req.url));
    }
  }
  
  // ... rest of middleware
});
```

### 2. **Custom Permissions**
Users có thể có custom permissions lưu trong trường `permissions`:

```json
{
  "userId": "user123",
  "role": "USER", 
  "customPermissions": [
    {
      "resource": "products",
      "action": "create", 
      "level": 2,
      "conditions": { "departmentId": "sales" }
    }
  ]
}
```

### 3. **Conditional Permissions**
Kiểm tra permissions với điều kiện:

```typescript
permissionChecker.hasConditionalPermission(
  RESOURCES.ORDERS, 
  ACTIONS.APPROVE,
  { departmentId: "finance", amount: { "$lte": 10000 } }
);
```

## 🔧 Tích hợp vào code hiện tại

### 1. **Migration các API routes hiện tại**
- Thay thế `auth()` check bằng `withXxxPermission()` middleware
- Sử dụng `NextRequest`/`NextResponse` thay vì `Request`/`Response`
- Đảm bảo error handling consistent

### 2. **Migration các admin pages**
- Thay thế `rolesCheck()` và `permissionsCheck()` bằng `PermissionChecker`
- Sử dụng resource/action/level cụ thể thay vì string permissions

### 3. **Migration client components**
- Wrap conditional rendering trong `<PermissionGate>`
- Sử dụng các component shortcuts như `<AdminOnly>`, `<CanEditXxx>`

## 📚 Ví dụ tích hợp hoàn chỉnh

### API Route hoàn chỉnh:
```typescript
// /src/app/api/v1/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withProductsPermission } from "@/lib/auth-middleware";
import { ACTIONS, PERMISSION_LEVELS } from "@/lib/permissions";

export const GET = withProductsPermission(ACTIONS.READ)(async (req: NextRequest) => {
  try {
    const products = await db.product.findMany();
    return NextResponse.json({ data: products, success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
});

export const POST = withProductsPermission(ACTIONS.CREATE, PERMISSION_LEVELS.WRITE)(async (req: NextRequest) => {
  try {
    const body = await req.json();
    const product = await db.product.create({ data: body });
    return NextResponse.json({ data: product, success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
});
```

### Admin Page hoàn chỉnh:
```typescript
// /src/app/admin/products/page.tsx
import { createPermissionChecker, RESOURCES, ACTIONS } from "@/lib/permissions";

export default async function ProductsPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/authentication/login");
  }

  const permissionChecker = createPermissionChecker({
    userId: session.user.id as string,
    role: session.user.role as 'ADMIN' | 'MODERATOR' | 'USER',
    customPermissions: session.user.permissions ? JSON.parse(session.user.permissions) : undefined
  });

  if (!permissionChecker.hasPermission(RESOURCES.PRODUCTS, ACTIONS.READ)) {
    redirect("/admin/deny");
  }

  return <ProductsManagement permissionChecker={permissionChecker} />;
}
```

## ✅ Lợi ích của hệ thống mới

1. **Granular Control**: Kiểm soát quyền chi tiết theo resource/action/level
2. **Flexible**: Hỗ trợ custom permissions và conditional permissions  
3. **Consistent**: API và UI sử dụng cùng một hệ thống permission
4. **Scalable**: Dễ dàng thêm resources, actions, levels mới
5. **Type Safe**: Full TypeScript support với auto-complete
6. **Performance**: Efficient permission checking với caching
7. **Security**: Multi-layer protection từ middleware đến component level

## 🎯 Roadmap tiếp theo

1. **Permission Management UI**: Tạo interface để admin quản lý permissions
2. **Audit Logging**: Log tất cả permission checks và access attempts  
3. **Role Templates**: Tạo role templates cho các use case phổ biến
4. **Time-based Permissions**: Permissions có thời hạn
5. **IP-based Restrictions**: Giới hạn truy cập theo IP
6. **Permission Caching**: Cache permissions để tăng performance
