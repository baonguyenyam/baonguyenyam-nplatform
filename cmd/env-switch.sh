#!/bin/bash

# Script to switch environment files for Docker development

case "$1" in
    "docker")
        echo "🐳 Switching to Docker environment..."
        if [ -f .env ]; then
            cp .env .env.local.backup
            echo "📁 Backed up current .env to .env.local.backup"
        fi
        cp .env.docker .env
        echo "✅ Using Docker environment variables"
        echo "🔗 Database: postgresql://postgres:root@localhost:5435/madeplatform"
        ;;
    "local")
        echo "🏠 Switching to local environment..."
        if [ -f .env.local.backup ]; then
            cp .env.local.backup .env
            echo "✅ Restored local environment from backup"
        else
            echo "⚠️  No backup found. Please restore your local .env manually"
        fi
        ;;
    "backup")
        if [ -f .env ]; then
            cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
            echo "✅ Created backup of current .env"
        else
            echo "❌ No .env file found"
        fi
        ;;
    *)
        echo "🔧 Environment Switcher for nPlatform"
        echo ""
        echo "Usage: $0 {docker|local|backup}"
        echo ""
        echo "Commands:"
        echo "  docker - Switch to Docker environment (port 5435)"
        echo "  local  - Switch back to local environment"
        echo "  backup - Create a backup of current .env"
        echo ""
        ;;
esac
