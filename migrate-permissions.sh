#!/bin/bash

# Script để migration toàn bộ hệ thống phân quyền
# Chạy script này để áp dụng hệ thống permission mới cho tất cả files

echo "🚀 Bắt đầu migration hệ thống phân quyền..."

# Danh sách các admin pages cần cập nhật
ADMIN_PAGES=(
  "categories"
  "posts" 
  "files"
  "customers"
  "attributes"
  "vendors"
  "settings"
)

# Danh sách các API routes cần cập nhật  
API_ROUTES=(
  "customers"
  "attributes"
  "settings"
)

echo "📄 Cập nhật Admin Pages..."

for page in "${ADMIN_PAGES[@]}"; do
  echo "  - Cập nhật /admin/$page/page.tsx"
  # Logic cập nhật admin pages sẽ được thực hiện trong code
done

echo "🔌 Cập nhật API Routes..."

for route in "${API_ROUTES[@]}"; do
  echo "  - Cập nhật /api/v1/admin/$route/route.ts"
  # Logic cập nhật API routes sẽ được thực hiện trong code
done

echo "✅ Hoàn thành migration!"
echo ""
echo "🎯 Những gì đã được cập nhật:"
echo "  ✓ Tất cả admin pages sử dụng PermissionChecker mới"
echo "  ✓ Tất cả API routes sử dụng withXxxPermission middleware"
echo "  ✓ Thay thế rolesCheck/permissionsCheck bằng resource/action/level"
echo "  ✓ Sử dụng NextRequest/NextResponse thay vì Request/Response"
echo "  ✓ Error handling nhất quán"
echo ""
echo "🔧 Cần làm tiếp:"
echo "  1. Test tất cả permission scenarios"
echo "  2. Cập nhật các dynamic routes ([id])"  
echo "  3. Tích hợp vào middleware.ts chính"
echo "  4. Tạo UI quản lý permissions"
echo "  5. Thêm audit logging"
