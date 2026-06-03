#!/bin/bash

services=("microservices-api-gateway" "microservices-service-registry" "microservices-user-mgmt" "microservices-product-mgmt" "microservices-security" "microservices-email" "microservices-frontend" )

for service in "${services[@]}"; do
  echo "🚀 Deleting Docker image: $service"

  if docker image inspect "$service" > /dev/null 2>&1; then
    docker rmi -f "$service"
    echo "✅ Image deleted: $service"
  else
    echo "⚠️ Image not found: $service"
  fi

  echo "-----------------------------------"
done
