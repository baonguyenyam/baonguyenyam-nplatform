#!/bin/bash

# Script to run standalone Next.js application locally
echo "🚀 Starting standalone Next.js application..."

# Check if standalone build exists
if [ ! -d ".next/standalone" ]; then
    echo "❌ Standalone build not found!"
    echo "🔧 Please run the build first:"
    echo "   ./cmd/build-standalone.sh"
    exit 1
fi

# Check if static files are copied
if [ ! -d ".next/standalone/.next/static" ]; then
    echo "📁 Copying static files..."
    cp -r .next/static .next/standalone/.next/
fi

# Check if public files are copied
if [ ! -d ".next/standalone/public" ]; then
    echo "📁 Copying public files..."
    cp -r public .next/standalone/
fi

# Copy environment file
if [ -f ".env" ]; then
    echo "📁 Copying environment file..."
    cp .env .next/standalone/
fi

# Set default environment variables if not set
export PORT=${PORT:-3000}
export HOSTNAME=${HOSTNAME:-localhost}
export NEXTAUTH_URL=${NEXTAUTH_URL:-http://localhost:3000}

echo "🌐 Starting server on http://${HOSTNAME}:${PORT}"
echo "📋 Environment:"
echo "   NODE_ENV: ${NODE_ENV:-production}"
echo "   PORT: ${PORT}"
echo "   HOSTNAME: ${HOSTNAME}"
echo ""
echo "🔧 Make sure you have set the required environment variables:"
echo "   - DATABASE_URL"
echo "   - NEXTAUTH_SECRET"
echo "   - NEXTAUTH_URL (set to: ${NEXTAUTH_URL})"
echo "   - PUBLIC_SITE_URL"
echo "   - PUBLIC_API_URL"
echo "   - And other required variables..."
echo ""

# Start the standalone server with proper hostname binding
cd .next/standalone
HOSTNAME=${HOSTNAME} PORT=${PORT} node server.js
