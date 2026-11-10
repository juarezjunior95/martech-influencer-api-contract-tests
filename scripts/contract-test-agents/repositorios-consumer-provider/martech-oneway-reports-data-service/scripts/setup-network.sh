#!/bin/bash

# Script to setup shared network between microservices
# Run this script from the directory before starting services

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
echo "🚀 Now you can start the services"
