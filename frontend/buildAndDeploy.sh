#!/bin/bash

# Stop execution on any error
set -e
set -o pipefail

# -------- Colors --------
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
echo -e "${BLUE} 🔨 Building Docker image...${NC}"

##docker build --build-arg VITE_API_BASE_URL=http://127.0.0.1:8079 -t frontend .

echo -e "${YELLOW} 🛑 Stopping all running containers...${NC}"
#Down all runnig containers
docker compose -f docker-compose.yml down

echo -e "${RED} 🧹 Cleaning up...${NC}"
## Delete the image
docker rmi -f frontend-frontend

echo -e "${GREEN} 🚀 Starting containers...${NC}"
docker compose -f docker-compose.yml up -d

echo -e "${GREEN}✅ All steps completed successfully.${NC}"