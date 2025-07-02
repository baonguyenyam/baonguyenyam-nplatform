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

# Set default environment variables if not set
export PORT=${PORT:-3000}
export HOSTNAME=${HOSTNAME:-0.0.0.0}

echo "🌐 Starting server on http://${HOSTNAME}:${PORT}"
echo "📋 Environment:"
echo "   NODE_ENV: ${NODE_ENV:-production}"
echo "   PORT: ${PORT}"
echo "   HOSTNAME: ${HOSTNAME}"
echo ""
echo "🔧 Make sure you have set the required environment variables:"
echo "   - DATABASE_URL"
echo "   - NEXTAUTH_SECRET"
echo "   - NEXTAUTH_URL"
echo "   - And other required variables..."
echo ""

# Start the standalone server
cd .next/standalone
node server.js
