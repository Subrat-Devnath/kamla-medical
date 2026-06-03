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


#echo -e "${BLUE}🔨 Building services...${NC}"
#bash build-services.sh

#echo -e "${YELLOW}🛑 Stopping all running containers...${NC}"
#bash stop-containers.sh

#echo -e "${RED}🧹 Deleting Docker images...${NC}"
#bash delete-images.sh

#echo -e "${BLUE}🚀 Starting all containers...${NC}"
#docker compose -f docker-compose.yml up -d

echo "${RED}Stopping containers...${NC}"
docker compose down

echo "${YELLOW}Removing old containers...${NC}"
docker container prune -f


echo -e "${GREEN}🚀 Starting Deployment${NC}"


docker compose up -d --build



echo -e "${GREEN}✅ All steps completed successfully.${NC}"
