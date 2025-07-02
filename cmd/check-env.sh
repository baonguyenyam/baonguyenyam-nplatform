#!/bin/bash

# Script to check environment variables for standalone deployment
echo "🔍 Checking environment variables..."

# Function to check if environment variable is set
check_env() {
    local var_name=$1
    local var_value=${!var_name}
    
    if [ -z "$var_value" ]; then
        echo "❌ $var_name is not set"
        return 1
    else
        echo "✅ $var_name is set"
        return 0
    fi
}

# Load .env file if it exists
if [ -f ".env" ]; then
    echo "📋 Loading .env file..."
    set -a
    source .env
    set +a
fi

# Check required variables
echo ""
echo "📋 Required environment variables:"
check_env "DATABASE_URL"
check_env "NEXTAUTH_SECRET"
check_env "PUBLIC_SITE_URL"
check_env "PUBLIC_API_URL"

echo ""
echo "📋 Optional but recommended:"
check_env "NEXTAUTH_URL"
check_env "NODE_ENV"

# Check if using localhost URLs
echo ""
echo "📋 URL Configuration:"
echo "   PUBLIC_SITE_URL: ${PUBLIC_SITE_URL:-not set}"
echo "   PUBLIC_API_URL: ${PUBLIC_API_URL:-not set}"
echo "   NEXTAUTH_URL: ${NEXTAUTH_URL:-not set}"

# Warn if not using localhost for local development
if [[ "${PUBLIC_SITE_URL}" != *"localhost"* && "${PUBLIC_SITE_URL}" != *"127.0.0.1"* ]]; then
    echo "⚠️  Warning: PUBLIC_SITE_URL is not using localhost - this might cause issues in local development"
fi

if [[ "${PUBLIC_API_URL}" != *"localhost"* && "${PUBLIC_API_URL}" != *"127.0.0.1"* ]]; then
    echo "⚠️  Warning: PUBLIC_API_URL is not using localhost - this might cause API connection issues"
fi

echo ""
echo "🚀 To start standalone server: ./cmd/start-standalone.sh"
