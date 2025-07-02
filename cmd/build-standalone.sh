#!/bin/bash

# Build script for standalone Next.js application
echo "🏗️  Building standalone Next.js application..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next

# Build the application
echo "📦 Building the application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo ""
    echo "📋 To run the standalone application:"
    echo "   1. Copy the entire '.next/standalone' folder to your server"
    echo "   2. Copy the '.next/static' folder to '.next/standalone/.next/static'"
    echo "   3. Copy the 'public' folder to '.next/standalone/public'"
    echo "   4. Set environment variables (DATABASE_URL, NEXTAUTH_SECRET, etc.)"
    echo "   5. Run: node .next/standalone/server.js"
    echo ""
    echo "📁 Standalone build location: .next/standalone/"
    echo "📁 Static files location: .next/static/"
    echo "📁 Public files location: public/"
else
    echo "❌ Build failed!"
    exit 1
fi
