#!/bin/bash

# Complete setup script for nPlatform with Docker

echo "🚀 nPlatform Docker Setup"
echo "=========================="

# Function to check which docker compose command is available
get_compose_cmd() {
    if command -v docker-compose &> /dev/null; then
        echo "docker-compose"
    elif docker compose version &> /dev/null; then
        echo "docker compose"
    else
        echo "❌ Neither 'docker-compose' nor 'docker compose' is available"
        exit 1
    fi
}

COMPOSE_CMD=$(get_compose_cmd)

# Function to check if docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Function to wait for postgres to be ready
wait_for_postgres() {
    echo "⏳ Waiting for PostgreSQL to be ready..."
    max_attempts=30
    attempts=0
    
    while [ $attempts -lt $max_attempts ]; do
        if $COMPOSE_CMD exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
            echo "✅ PostgreSQL is ready!"
            return 0
        fi
        
        attempts=$((attempts + 1))
        echo "   Attempt $attempts/$max_attempts - Waiting for database..."
        sleep 2
    done
    
    echo "❌ PostgreSQL failed to start after $max_attempts attempts"
    return 1
}

case "$1" in
    "setup")
        echo "🔧 Setting up nPlatform with Docker..."
        
        # Check Docker
        check_docker
        
        # Stop any existing containers
        echo "🛑 Stopping existing containers..."
        $COMPOSE_CMD down
        
        # Start PostgreSQL
        echo "🐘 Starting PostgreSQL..."
        $COMPOSE_CMD up -d postgres
        
        # Wait for PostgreSQL to be ready
        if wait_for_postgres; then
            echo "🔄 Running database migrations..."
            npm run prisma:db:push || yarn prisma:db:push || npx prisma db push
            
            echo "🌱 Running database seed..."
            npm run prisma:seed || yarn prisma:seed || npx prisma db seed
            
            echo ""
            echo "✅ Setup complete!"
            echo "🔗 Database URL: postgresql://postgres:root@localhost:5435/madeplatform"
            echo "🚀 You can now run: npm run dev"
        else
            echo "❌ Setup failed - PostgreSQL is not ready"
            exit 1
        fi
        ;;
    
    "dev")
        echo "🚀 Starting development environment..."
        
        # Check Docker
        check_docker
        
        # Start PostgreSQL if not running
        if ! $COMPOSE_CMD ps postgres | grep -q "Up"; then
            echo "🐘 Starting PostgreSQL..."
            $COMPOSE_CMD up -d postgres
            wait_for_postgres
        else
            echo "✅ PostgreSQL is already running"
        fi
        
        # Start the application
        echo "🚀 Starting nPlatform application..."
        npm run dev || yarn dev
        ;;
    
    "clean")
        echo "🧹 Cleaning up Docker environment..."
        $COMPOSE_CMD down -v
        docker volume rm nplatform_postgres_data 2>/dev/null || true
        echo "✅ Cleanup complete"
        ;;
    
    *)
        echo "nPlatform Docker Management"
        echo ""
        echo "Usage: $0 {setup|dev|clean}"
        echo ""
        echo "Commands:"
        echo "  setup - Complete setup (database + migrations + seed)"
        echo "  dev   - Start development environment"
        echo "  clean - Clean up all Docker data"
        echo ""
        echo "For more Docker commands, use: ./cmd/docker.sh"
        ;;
esac
