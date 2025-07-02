#!/bin/bash

# Build script for Netlify deployment
echo "🌐 Building for Netlify deployment..."

# Set environment variables
export NETLIFY=true
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next .netlify

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --legacy-peer-deps

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate --no-engine

# Build the application
echo "🏗️  Building the application..."
npm run build:netlify

# Create Netlify functions structure
echo "📂 Setting up Netlify functions..."
mkdir -p .netlify/functions
mkdir -p .netlify/functions-internal

# Copy server files
if [ -d ".next/server" ]; then
    cp -r .next/server .netlify/functions-internal/
fi

# Copy static files
if [ -d ".next/static" ]; then
    cp -r .next/static .netlify/static
fi

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Netlify build completed successfully!"
    echo ""
    echo "📋 Files ready for Netlify deployment:"
    echo "   📁 .netlify/functions-internal/ - Server functions"
    echo "   📁 .netlify/static/ - Static assets"
else
    echo "❌ Build failed!"
    exit 1
fi
