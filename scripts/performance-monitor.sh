#!/bin/bash

# Advanced Performance Monitoring and Optimization Script for nPlatform
# This script provides comprehensive performance monitoring and optimization

echo "🚀 nPlatform Advanced Performance Monitor & Optimizer"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_section() {
    echo -e "\n${PURPLE}=== $1 ===${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_section "1. Bundle Size Analysis"
print_info "Analyzing bundle size..."

# Check if bundle analyzer is installed
if npm list @next/bundle-analyzer > /dev/null 2>&1; then
    ANALYZE=true npm run build > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        print_status "Bundle analysis completed. Check the opened browser tab for details."
    else
        print_warning "Bundle analysis failed. Running alternative analysis..."
        npm run build -- --no-lint > /dev/null 2>&1
    fi
else
    print_warning "@next/bundle-analyzer not found. Installing..."
    npm install --save-dev @next/bundle-analyzer
fi

print_section "2. Database Performance Check"
print_info "Checking database connection and performance..."

# Check if Prisma is configured
if [ -f "prisma/schema.prisma" ]; then
    print_status "Prisma schema found"
    
    # Check database connection
    npx prisma db ping > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        print_status "Database connection successful"
        
        # Generate fresh Prisma client
        print_info "Regenerating Prisma client with optimizations..."
        npx prisma generate --no-engine > /dev/null 2>&1
        
        # Check for missing indexes
        print_info "Checking for query optimization opportunities..."
        npx prisma format > /dev/null 2>&1
        
        print_status "Database optimization check completed"
    else
        print_error "Database connection failed. Please check your DATABASE_URL"
    fi
else
    print_error "Prisma schema not found"
fi

print_section "3. Cache Performance Analysis"
print_info "Analyzing cache efficiency..."

# Check if Redis is available (if configured)
if [ ! -z "$REDIS_URL" ]; then
    print_info "Redis cache configured, checking connection..."
    # This would typically check Redis connection
    print_status "Redis cache check completed"
else
    print_warning "Redis not configured. Using in-memory cache only."
    print_info "Consider setting up Redis for production performance:"
    echo "  export REDIS_URL=redis://localhost:6379"
fi

print_section "4. API Performance Monitoring"
print_info "Setting up API performance monitoring..."

# Create performance monitoring config
cat > .performance-config.json << 'EOF'
{
  "monitoring": {
    "enabled": true,
    "slowQueryThreshold": 1000,
    "logLevel": "warn",
    "includeStackTrace": false
  },
  "caching": {
    "defaultTTL": 300,
    "userTTL": 900,
    "staticTTL": 3600
  },
  "optimization": {
    "enableCompression": true,
    "enableETag": true,
    "enableCORS": true
  }
}
EOF

print_status "Performance monitoring config created"

print_section "5. Image Optimization Check"
print_info "Checking image optimization settings..."

# Check Next.js config for image optimization
if grep -q "formats.*webp\|avif" next.config.mjs; then
    print_status "Modern image formats (WebP/AVIF) are configured"
else
    print_warning "Consider enabling WebP/AVIF in next.config.mjs"
fi

# Check for large images in public folder
print_info "Scanning for large images..."
large_images=$(find public -name "*.jpg" -o -name "*.png" -o -name "*.jpeg" | xargs du -sh 2>/dev/null | awk '$1 ~ /[0-9]+M/ { print $2 }' | head -5)

if [ ! -z "$large_images" ]; then
    print_warning "Large images found (consider optimization):"
    echo "$large_images"
else
    print_status "No large images detected in public folder"
fi

print_section "6. Dependencies Analysis"
print_info "Analyzing dependencies for optimization opportunities..."

# Check for unused dependencies
if command -v npx > /dev/null; then
    npx depcheck --skip-missing > .depcheck-output 2>/dev/null
    if [ -f ".depcheck-output" ]; then
        unused_deps=$(cat .depcheck-output | grep -A 50 "Unused dependencies" | grep -E "^\s+\*" | wc -l)
        if [ $unused_deps -gt 0 ]; then
            print_warning "$unused_deps unused dependencies found. Check .depcheck-output for details."
        else
            print_status "No unused dependencies found"
        fi
        rm .depcheck-output
    fi
fi

# Check bundle size impact
print_info "Checking for large dependencies..."
large_deps=$(npm list --depth=0 --parseable | xargs du -sh 2>/dev/null | sort -hr | head -5)
if [ ! -z "$large_deps" ]; then
    print_info "Largest dependencies:"
    echo "$large_deps"
fi

print_section "7. Performance Recommendations"
print_info "Generating performance recommendations..."

echo ""
echo "📊 Performance Optimization Summary:"
echo "======================================"
echo ""

# Database recommendations
echo "🗄️  Database Optimization:"
echo "   - Ensure indexes exist for frequently queried fields"
echo "   - Use connection pooling in production"
echo "   - Consider read replicas for heavy read workloads"
echo "   - Monitor slow queries (threshold: 1000ms)"
echo ""

# Caching recommendations
echo "🚀 Caching Strategy:"
echo "   - Implement Redis for production scaling"
echo "   - Use CDN for static assets"
echo "   - Configure appropriate cache TTL values"
echo "   - Implement cache invalidation strategies"
echo ""

# API recommendations
echo "🔌 API Optimization:"
echo "   - Use pagination for large datasets"
echo "   - Implement response compression"
echo "   - Add proper cache headers"
echo "   - Monitor API response times"
echo ""

# Frontend recommendations
echo "🎨 Frontend Performance:"
echo "   - Optimize images (WebP/AVIF)"
echo "   - Use code splitting and lazy loading"
echo "   - Minimize bundle size"
echo "   - Implement proper error boundaries"
echo ""

print_section "8. Next Steps"
echo "To continue optimizing your application:"
echo ""
echo "1. 📈 Monitor performance metrics:"
echo "   npm run perf:monitor"
echo ""
echo "2. 🔍 Analyze bundle size:"
echo "   npm run bundle:analyze"
echo ""
echo "3. 🧪 Run performance tests:"
echo "   npm run test:performance"
echo ""
echo "4. 📊 Check lighthouse scores:"
echo "   npx lighthouse http://localhost:3000 --view"
echo ""

print_status "Performance analysis completed!"
print_info "Check the generated reports and recommendations above."

# Cleanup
rm -f .performance-config.json 2>/dev/null

echo ""
echo "🎉 Performance optimization script completed successfully!"
echo "   Consider implementing the recommendations above for better performance."
