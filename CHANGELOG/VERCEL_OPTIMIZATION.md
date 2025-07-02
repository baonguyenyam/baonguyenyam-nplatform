# Giải pháp khắc phục lỗi Vercel Serverless Functions Limit

## Vấn đề
Dự án đang gặp lỗi: "No more than 12 Serverless Functions can be added to a Deployment on the Hobby plan" khi deploy lên Vercel.

## Nguyên nhân
- Dự án có **30+ API routes** trong thư mục `src/app/api/`
- Mỗi API route file tạo ra một serverless function riêng biệt
- Vercel Hobby plan chỉ cho phép tối đa 12 serverless functions

## Giải pháp đã áp dụng

### 1. Tạo Server Actions thay thế API Routes
- **File**: `src/lib/admin-actions.ts`
- **Mục đích**: Chuyển các API endpoints sang Server Actions để giảm số lượng serverless functions
- **Bao gồm**: CRUD operations cho Posts, Users, Categories

### 2. Cấu hình Vercel tối ưu
- **File**: `vercel.json`
- **Thay đổi**:
  - Chỉ định cụ thể các functions cần thiết
  - Sử dụng rewrites để gộp các routes tương tự
  - Đặt maxDuration thấp hơn để tối ưu hóa

### 3. Tối ưu hóa Next.js Config
- **File**: `next.config.mjs`
- **Thêm**:
  - `bundlePagesRouterDependencies: true`
  - Tối ưu hóa package imports
  - Server external packages

## Hướng dẫn sử dụng

### Thay thế API calls bằng Server Actions

**Trước (API Route):**
```javascript
const response = await fetch('/api/v1/admin/posts', {
  method: 'POST',
  body: JSON.stringify(data)
});
```

**Sau (Server Action):**
```javascript
import { createPost } from '@/lib/admin-actions';

const result = await createPost(formData);
```

### Các Server Actions có sẵn

#### Posts
- `getPosts(params)` - Lấy danh sách posts
- `createPost(formData)` - Tạo post mới
- `updatePost(id, formData)` - Cập nhật post
- `deletePost(id)` - Xóa post

#### Users  
- `getUsers(params)` - Lấy danh sách users
- `createUser(formData)` - Tạo user mới
- `deleteUser(id)` - Xóa user

#### Categories
- `getCategories()` - Lấy danh sách categories
- `createCategory(formData)` - Tạo category mới
- `deleteCategory(id)` - Xóa category

## Các bước tiếp theo

### 1. Cập nhật Frontend Components
Thay thế các API calls trong components với Server Actions:

```javascript
// components/admin/PostForm.jsx
import { createPost, updatePost } from '@/lib/admin-actions';

export default function PostForm() {
  async function handleSubmit(formData) {
    const result = await createPost(formData);
    if (result.success) {
      // Handle success
    }
  }
  
  return (
    <form action={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### 2. Xóa các API Routes không cần thiết
Sau khi đã chuyển sang Server Actions, có thể xóa các API routes sau:
- `src/app/api/v1/admin/posts/route.ts`
- `src/app/api/v1/admin/users/route.ts`  
- `src/app/api/v1/admin/categories/route.ts`

### 3. Kiểm tra Deployment
Deploy dự án lên Vercel và kiểm tra:
- Số lượng serverless functions đã giảm xuống dưới 12
- Các chức năng admin vẫn hoạt động bình thường

## Lưu ý quan trọng

1. **Server Actions** chỉ hoạt động trong Server Components hoặc Client Components với 'use server' directive
2. **Form Data**: Server Actions nhận FormData thay vì JSON
3. **Error Handling**: Server Actions trả về object thay vì Response
4. **Revalidation**: Sử dụng `revalidatePath()` để refresh cache sau khi cập nhật dữ liệu

## Kiểm tra hiệu quả

Sau khi áp dụng các giải pháp trên, số lượng serverless functions sẽ giảm từ 30+ xuống còn:
- 1 function cho auth
- 1 function cho API v1 base
- 1 function cho admin base
- Các functions còn lại cho các endpoints thực sự cần thiết

Tổng cộng sẽ < 12 functions, phù hợp với Vercel Hobby plan.
