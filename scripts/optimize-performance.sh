#!/bin/bash

# Performance Optimization Migration Script for nPlatform
# This script applies database indexes and performance improvements

echo "🚀 Starting nPlatform Performance Optimization..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_status "Found package.json, proceeding with optimization..."

# Clean npm cache if needed
print_status "Cleaning npm cache..."
npm cache clean --force 2>/dev/null

# Generate Prisma client with new schema
print_status "Generating Prisma client with performance optimizations..."
if ! npx prisma generate --no-engine; then
    print_warning "Failed to generate Prisma client with npx, trying with yarn..."
    if ! yarn prisma generate --no-engine; then
        print_error "Failed to generate Prisma client. Please check your database configuration."
        exit 1
    fi
fi

# Format Prisma schema
print_status "Formatting Prisma schema..."
npx prisma format 2>/dev/null || yarn prisma format 2>/dev/null

# Create migration
print_status "Creating database migration for performance indexes..."
if ! npx prisma migrate dev --name "add_performance_indexes" --skip-seed; then
    print_warning "Failed to create migration with npx, trying with yarn..."
    if ! yarn prisma migrate dev --name "add_performance_indexes" --skip-seed; then
        print_error "Failed to create migration. Please check your database connection."
        print_warning "You can manually run: npx prisma migrate dev --name add_performance_indexes"
        exit 1
    fi
fi

print_status "Database migration completed successfully!"

# Check if Next.js dev server is running and suggest restart
if pgrep -f "next dev" > /dev/null; then
    print_warning "Next.js dev server is running. Please restart it to apply all changes:"
    print_warning "  1. Stop the current dev server (Ctrl+C)"
    print_warning "  2. Run: npm run dev or yarn dev"
fi

echo ""
print_status "🎉 Performance optimization completed successfully!"
echo ""
echo "📊 Performance improvements applied:"
echo "   • Database indexes for faster queries"
echo "   • In-memory caching system"
echo "   • Rate limiting for API protection"
echo "   • Optimized API response format"
echo "   • Enhanced Next.js configuration"
echo ""
echo "📖 For detailed information, see: PERFORMANCE_OPTIMIZATION.md"
echo ""
print_status "Your nPlatform should now run significantly faster!"
