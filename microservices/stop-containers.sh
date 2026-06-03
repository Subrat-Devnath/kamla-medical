#!/bin/bash

echo "Stoping all contailers"

#Down all runnig containers
docker compose -f docker-compose.yml down

