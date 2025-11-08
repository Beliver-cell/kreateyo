#!/bin/bash

# ===================================
# KREATEYO PRODUCTION DEPLOYMENT
# ===================================

set -e  # Exit on error

echo "🚀 Starting Kreateyo deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${RED}❌ Error: .env.production file not found${NC}"
    echo "Please create .env.production from .env.production.example"
    exit 1
fi

# Load environment variables
set -a
source .env.production
set +a

echo "📋 Checking prerequisites..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p ssl backups nginx/conf.d nginx/logs

# Pull latest images
echo "📦 Pulling Docker images..."
docker-compose -f docker-compose.production.yml pull

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.production.yml down

# Build images
echo "🔨 Building application images..."
docker-compose -f docker-compose.production.yml build --no-cache

# Start services
echo "▶️  Starting services..."
docker-compose -f docker-compose.production.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to start..."
sleep 30

# Health checks
echo "🏥 Running health checks..."

check_service() {
    local service=$1
    local url=$2
    
    if curl -f -s $url > /dev/null; then
        echo -e "${GREEN}✅ $service is healthy${NC}"
        return 0
    else
        echo -e "${RED}❌ $service health check failed${NC}"
        return 1
    fi
}

HEALTH_CHECKS=0

# Check backend
if check_service "Backend API" "http://localhost:5000/health"; then
    ((HEALTH_CHECKS++))
fi

# Check frontend
if check_service "Frontend" "http://localhost:3000/health"; then
    ((HEALTH_CHECKS++))
fi

# Check MongoDB
if docker-compose -f docker-compose.production.yml exec -T mongodb mongosh --quiet --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ MongoDB is healthy${NC}"
    ((HEALTH_CHECKS++))
else
    echo -e "${RED}❌ MongoDB health check failed${NC}"
fi

# Check Redis
if docker-compose -f docker-compose.production.yml exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Redis is healthy${NC}"
    ((HEALTH_CHECKS++))
else
    echo -e "${RED}❌ Redis health check failed${NC}"
fi

echo ""
echo "════════════════════════════════════════"
echo "📊 Deployment Summary"
echo "════════════════════════════════════════"
echo "Health Checks: $HEALTH_CHECKS/4 passed"
echo ""
echo "🌐 Services:"
echo "   Main App: http://kreateyo.com (port 80/443)"
echo "   API: http://api.kreateyo.com:5000"
echo "   Frontend: http://localhost:3000"
echo ""
echo "🗄️  Database:"
echo "   MongoDB: localhost:27017"
echo "   Redis: localhost:6379"
echo ""

if [ $HEALTH_CHECKS -eq 4 ]; then
    echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
    echo ""
    echo "⚠️  NEXT STEPS:"
    echo "1. Configure DNS records:"
    echo "   A record: kreateyo.com → $SERVER_IP"
    echo "   A record: *.kreateyo.com → $SERVER_IP"
    echo ""
    echo "2. Install SSL certificates in ./ssl/ directory"
    echo "   - kreateyo.com.crt"
    echo "   - kreateyo.com.key"
    echo ""
    echo "3. Restart nginx after SSL setup:"
    echo "   docker-compose -f docker-compose.production.yml restart nginx"
    echo ""
    echo "4. View logs:"
    echo "   docker-compose -f docker-compose.production.yml logs -f"
    exit 0
else
    echo -e "${RED}⚠️  Deployment completed with warnings${NC}"
    echo "Some services may not be fully operational"
    echo "Check logs: docker-compose -f docker-compose.production.yml logs"
    exit 1
fi
