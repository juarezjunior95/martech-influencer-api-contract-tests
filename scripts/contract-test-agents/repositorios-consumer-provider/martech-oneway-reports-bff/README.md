# Martech OneWay Reports BFF

A Backend for Frontend (BFF) service for the Martech OneWay Reports application, responsible for processing and formatting data from specific views for frontend consumption. This service acts as a data aggregation and transformation layer, providing an optimized API for frontend needs.

**Key Objectives:**
- Process specific views with dynamic configurations
- Aggregate data from multiple sources (datasources)
- Apply specific formatting using JSONata
- Provide an optimized API for the frontend
- Maintain clean architecture and DDD principles

**Data Flow:**
1. **HTTP Request** → Controller receives REST API request with view name and filters
2. **Validation** → DTOs validate input parameters and transform to domain objects
3. **Use Case** → Orchestrates the complete business flow and coordinates all steps
4. **Configuration** → Loads view-specific configuration (components, datasources, formatters)
5. **Entity** → Creates domain entity with business rules and validations
6. **Repositories** → Loads data from multiple sources (datasources) in parallel
7. **Formatting** → Applies specific JSONata formatters for each component
8. **Response** → Returns structured and formatted data ready for frontend consumption

**Development Environment:**
This project uses **Docker Compose** as the development environment. The `docker-compose up` command automatically starts the service in development mode (`start:debug`). All commands (lint, test, build) should be run using `docker-compose exec` to ensure consistency across different development machines and environments.

**Docker Compose Commands:**
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build

# Run npm commands inside container
docker-compose exec martech-oneway-reports-bff npm run [command]

# Example
docker-compose exec martech-oneway-reports-bff npm run lint
```

## Getting Started

### Software Dependencies

- **Docker** and **Docker Compose**
- **Git**

### Quick Start

1. **Clone the Repository**
```bash
git clone <repository-url>
cd martech-oneway-reports-bff
```

2. **Configure Environment Variables**
```bash
cp env.example .env
```

Edit the `.env` file with your specific configuration (see `env.example` for all available variables).

3. **Start the Service**
```bash
# Setup network and start with Docker Compose
./scripts/setup-network.sh && docker-compose up

# Or start directly (if network already exists)
docker-compose up
```

### API Documentation

- **Swagger UI**: `/v1/docs` (when running)
- **Health Check**: `GET /v1/actuator/health/liveness` or `GET /v1/actuator/health/readiness`
- **Views**: `GET /v1/views/{viewName}?filter[param]=value`
- **Images** (proxy to data service): `GET /v1/images/brand`, `GET /v1/images/country`

## Build and Test

### Build

```bash
# Compile the project
npm run build

# Start compiled version
npm run start:prod
```

### Test

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

### Code Quality

```bash
# Run linter
npm run lint

# Fix lint issues automatically
npm run lint:fix

# Format code with Prettier
npm run format
```

## Contribute

### How to Contribute

1. **Create a branch**
```bash
npm run branch
# or directly
./scripts/create-branch.sh
```

2. **Make your changes**

3. **Run tests and lint**
```bash
npm run test
npm run lint:fix
```

4. **Commit your changes**
```bash
npm run commit
```

5. **Open a Pull Request**

### Available Scripts

```bash
# Development
docker-compose up          # Start with Docker Compose (includes development mode)
npm run start              # Start the service normally
npm run start:dev          # Start in development mode with watch
npm run start:debug        # Start in debug mode

# Build and Production
npm run build              # Compile the project
npm run start:prod         # Start compiled version

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage
npm run test:debug         # Run tests in debug mode
npm run test:e2e           # Run end-to-end tests

# Code Quality
npm run lint               # Run linter
npm run lint:fix           # Fix lint issues automatically
npm run format             # Format code with Prettier

# Git and Deploy
npm run branch             # Create new branch
npm run commit             # Commit with conventional commits
npm run prepare            # Install husky (runs automatically)
```

### Testing Production Image

```bash
# Build and run production image with .env variables
docker build -t martech-oneway-reports-bff .
docker run -d --name martech-oneway-reports-bff-prod-test -p 8080:8080 \
  --env-file .env \
  -e NODE_ENV=production \
  -e APP_PORT=8080 \
  martech-oneway-reports-bff

# Test health endpoint
curl http://localhost:8080/v1/actuator/health/liveness

# Check NODE_ENV and other environment variables
docker exec martech-oneway-reports-bff-prod-test printenv | grep NODE_ENV

# Or follow logs in real-time (in another terminal)
docker logs -f martech-oneway-reports-bff-prod-test

# Cleanup
docker stop martech-oneway-reports-bff-prod-test && docker rm martech-oneway-reports-bff-prod-test
```

### Troubleshooting

**Common Issues:**
- **Redis connection error**: Check environment variables
- **Docker network error**: Run `./scripts/setup-network.sh`
- **TypeScript compilation error**: Run `npm run build` for detailed errors
- **Port already in use**: Change `APP_PORT` in `.env` or stop other services on port 8080
- **JSONata formatting error**: Check syntax of `.jsonata` files in `src/infrastructure/formatters/`

## Project Architecture

The project follows **Clean Architecture** and **Domain-Driven Design (DDD)** principles:

```
src/
├── application/           # Application Layer
│   ├── interfaces/       # Contracts/Interfaces
│   └── usecases/         # Application use cases
├── common/               # Shared utilities
│   ├── config/          # Global configurations
│   ├── interceptors/    # Interceptors (timeout, etc.)
│   ├── pipes/           # Validation pipes
│   ├── swagger/         # Swagger configuration
│   └── utils/           # General utilities
├── config/              # Specific configurations (Swagger)
├── domain/              # Domain Layer (Core Business)
│   ├── entities/        # Business entities
│   ├── exceptions/      # Domain exceptions
│   ├── repositories/    # Repository interfaces
│   └── config/          # Domain configurations (views)
└── infrastructure/      # Infrastructure Layer
    ├── controllers/     # REST controllers
    ├── formatters/     # JSONata formatters
    ├── mappers/        # DTO ↔ Entity mappers
    ├── modules/        # NestJS modules
    ├── repositories/   # Repository implementations
    └── services/       # Service implementations
```

### Key Components

- **Controllers**: REST endpoints for API exposure
- **Use Cases**: Business logic and orchestration
- **Entities**: Domain models with business rules
- **Repositories**: Data access abstraction
- **Formatters**: Data processing using JSONata
- **Services**: External service integration (Data Service)
- **DTOs & Mappers**: Data Transfer Objects and conversion between DTOs and domain entities

### BFF-Specific Features

- **View Processing**: Dynamic view configuration with components
- **JSONata Formatting**: Data transformation using JSONata expressions
- **Data Aggregation**: Combination of multiple data sources
- **Frontend Optimization**: Structured response for direct frontend consumption
- **Parallel Processing**: Components processed in parallel for better performance