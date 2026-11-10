#!/bin/bash

# Script to setup shared network between microservices
# Run this script from the BFF directory before starting services

echo "🌐 Setting up shared network for microservices..."

# Create external network if it doesn't exist
if docker network ls | grep -q "martech-network"; then
    echo "✅ Network 'martech-network' already exists"
else
    echo "📡 Creating network 'martech-network'..."
    docker network create martech-network
    echo "✅ Network 'martech-network' created successfully!"
fi

echo ""
echo "🚀 Now you can start the services:"
echo "   📊 Data-service: cd ../temp-martech-oneway-reports-data-service && docker-compose up -d"
echo "   🌐 BFF: docker-compose up -d"
echo ""
echo "💡 To stop all services:"
echo "   docker-compose -f ../temp-martech-oneway-reports-data-service/docker-compose.yml down"
echo "   docker-compose down"
echo "   docker network rm martech-network"
