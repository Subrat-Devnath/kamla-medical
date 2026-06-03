#!/bin/bash

bash build-services.sh

services=("api-gateway" "service-registry" "user-mgmt" "product-mgmt" "security" "email")

#services=''

  ## remove image
  docker rmi frontend
  docker build -t frontend .

serviceCount=0

for service in "${services[@]}"; do
  echo "🚀 Building $service..."

  if [ "$serviceCount" -eq 0 ]; then
    cd "$service" 
  else
    cd "../$service"
  fi

  echo "Current directory: $(pwd)"

  ## remove image
  docker rmi "$service"

  docker build -t "$service" .
  serviceCount=$((serviceCount + 1))
  echo "Build success $service..."
done
