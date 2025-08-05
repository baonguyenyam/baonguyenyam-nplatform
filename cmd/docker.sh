#!/bin/bash

# Docker management script for nPlatform

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

case "$1" in
  "start")
    echo "🚀 Starting nPlatform services..."
    $COMPOSE_CMD up -d postgres
    echo "✅ PostgreSQL is starting up..."
    echo "⏳ Waiting for database to be ready..."
    sleep 5
    $COMPOSE_CMD logs postgres
    ;;
  "stop")
    echo "🛑 Stopping nPlatform services..."
    $COMPOSE_CMD down
    echo "✅ Services stopped"
    ;;
  "restart")
    echo "🔄 Restarting nPlatform services..."
    $COMPOSE_CMD down
    $COMPOSE_CMD up -d postgres
    echo "✅ Services restarted"
    ;;
  "logs")
    echo "📋 Showing PostgreSQL logs..."
    $COMPOSE_CMD logs -f postgres
    ;;
  "reset")
    echo "⚠️  Resetting database (This will delete all data!)"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      $COMPOSE_CMD down -v
      docker volume rm nplatform_postgres_data 2>/dev/null || true
      $COMPOSE_CMD up -d postgres
      echo "✅ Database reset complete"
    else
      echo "❌ Reset cancelled"
    fi
    ;;
  "status")
    echo "📊 Service status:"
    $COMPOSE_CMD ps
    ;;
  "shell")
    echo "🐚 Connecting to PostgreSQL shell..."
    $COMPOSE_CMD exec postgres psql -U postgres -d madeplatform
    ;;
  *)
    echo "🔧 nPlatform Docker Management"
    echo ""
    echo "Usage: $0 {start|stop|restart|logs|reset|status|shell}"
    echo ""
    echo "Commands:"
    echo "  start   - Start PostgreSQL service"
    echo "  stop    - Stop all services"
    echo "  restart - Restart all services"
    echo "  logs    - Show PostgreSQL logs"
    echo "  reset   - Reset database (deletes all data)"
    echo "  status  - Show service status"
    echo "  shell   - Connect to PostgreSQL shell"
    echo ""
    ;;
esac
