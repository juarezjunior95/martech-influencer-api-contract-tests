# Martech OneWay Reports Data Service

A core data service for the Martech OneWay Reports application, responsible for providing essential data through dynamic configurations. This service serves as the primary data layer for the OneWay Reports platform, enabling flexible data access and processing.

**Key Objectives:**
- Provide core data for the OneWay Reports application
- Enable dynamic configuration of data sources
- Maintain clean architecture principles for maintainability
- Ensure high performance and reliability for report generation

**Data Flow:**
1. **HTTP Request** → Controller receives REST API request with datasource name and filters
2. **Validation** → DTOs validate input parameters and transform to domain objects
3. **Use Case** → Orchestrates the complete business flow and coordinates all steps
4. **Configuration** → Loads datasource-specific configuration (datasets, handlers, etc.)
5. **Entity** → Creates domain entity with business rules and validations
6. **Repository** → Loads datasets from configured data sources
7. **Handler** → Processes datasets using datasource-specific business logic
8. **Response** → Returns structured data ready for consumption by clients

**Development Environment:**
This project uses **Docker Compose** as the development environment. The `docker-compose up` command automatically starts the service in development mode (`start:dev`). All commands (lint, test, build) should be run using `docker-compose exec` to ensure consistency across different development machines and environments.

**Docker Compose Commands:**
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# View PostgreSQL logs
docker-compose logs -f postgres

# Stop services
docker-compose down

# Stop and remove volumes (WARNING: deletes database data)
docker-compose down -v

# Rebuild and start
docker-compose up --build

# Run npm commands inside container
docker-compose exec martech-oneway-reports-data-service npm run [command]

# Example
docker-compose exec martech-oneway-reports-data-service npm run lint

# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d kpis
```

## Getting Started

### Software Dependencies

- **Docker** and **Docker Compose**
- **Git**

### Services Included

- **PostgreSQL 16.10**: Database service (automatically started with docker-compose)
  - Port: `5432` (configurable via `POSTGRES_PORT` in `.env`)
  - Default database: `kpis`
  - Default user: `postgres`
  - Data persistence: Docker volume `postgres_data`

### Quick Start

1. **Clone the Repository**
```bash
git clone <repository-url>
cd martech-oneway-reports-data-service
```

2. **Configure Environment Variables**
```bash
cp env.example .env
```

Edit the `.env` file with your specific configuration (see `env.example` for all available variables).

**PostgreSQL Configuration:**
- For Docker Compose: Use `POSTGRES_HOST=postgres` (service name)
- For local development: Use `POSTGRES_HOST=localhost`
- Default credentials: `postgres/postgres` (change in production!)

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

### Image CDN resolver

- **`CDN_BASE_URL`**: public base URL for rasterized brand/country assets (`GET /v1/images/*`, `getBrandImage` / `getCountryFlag` via `withImagePathPrefix`). See `env.example`.

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
docker build -t martech-oneway-reports-data-service .
docker run -d --name martech-oneway-reports-data-service-prod-test -p 3030:3030 \
  --env-file .env \
  -e NODE_ENV=production \
  -e APP_PORT=3030 \
  martech-oneway-reports-data-service

# Test health endpoint
curl http://localhost:3030/v1/actuator/health/liveness

# Check NODE_ENV and other environment variables
docker exec martech-oneway-reports-data-service-prod-test printenv | grep NODE_ENV

# Or follow logs in real-time (in another terminal)
docker logs -f martech-oneway-reports-data-service-prod-test

# Cleanup
docker stop martech-oneway-reports-data-service-prod-test && docker rm martech-oneway-reports-data-service-prod-test
```

### Troubleshooting

**Common Issues:**
- **Databricks connection error**: Check environment variables
- **Docker network error**: Run `./scripts/setup-network.sh`
- **TypeScript compilation error**: Run `npm run build` for detailed errors
- **Port already in use**: Change `APP_PORT` in `.env` or stop other services on port 3030
- **PostgreSQL connection error**:
  - Check if PostgreSQL container is running: `docker-compose ps`
  - Verify `POSTGRES_HOST` in `.env` (use `postgres` for Docker, `localhost` for local)
  - Check PostgreSQL logs: `docker-compose logs postgres`
  - Ensure PostgreSQL is healthy: `docker-compose exec postgres pg_isready -U postgres`

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
│   └── utils/           # General utilities
├── config/              # Specific configurations (Swagger)
├── domain/              # Domain Layer (Core Business)
│   ├── entities/        # Business entities
│   ├── exceptions/      # Domain exceptions
│   ├── repositories/    # Repository interfaces
│   └── config/          # Domain configurations
└── infrastructure/      # Infrastructure Layer
    ├── controllers/     # REST controllers
    ├── mappers/         # DTO ↔ Entity mappers
    ├── modules/         # NestJS modules
    ├── repositories/    # Repository implementations
    └── services/        # Service implementations
```

### Key Components

- **Controllers**: REST endpoints for API exposure
- **Use Cases**: Business logic and orchestration
- **Entities**: Domain models with business rules
- **Repositories**: Data access abstraction
- **Services**: External service integration
- **DTOs & Mappers**: Data Transfer Objects and conversion between DTOs and domain entities

## Data Source Configuration

The service supports multiple data providers through the datasource configuration system. Each dataset can specify which provider to use for data retrieval.

### Supported Providers

- **Databricks** (default): Big Data analytics and ML workloads
- **PostgreSQL**: Relational database for structured data

### Dataset Configuration

Datasets are configured in JSON files located in `src/domain/config/datasources/`. Each dataset can specify a `provider` field to determine which data source to use:

```json
{
  "version": "1.0.0",
  "datasets": [
    {
      "id": "example-dataset",
      "query": "example-query",
      "provider": "postgres"  // Optional: defaults to "databricks"
    }
  ]
}
```

### Provider Configuration

#### Databricks (Default)
- **Provider**: `"databricks"` or omitted (default)
- **Parameters**: Named parameters (`@param1`, `@param2`)
- **Repository**: `DatabricksDataRepository`
- **Client**: `DatabricksClient`

#### PostgreSQL
- **Provider**: `"postgres"`
- **Parameters**: Positional parameters (`$1`, `$2`, `$3`)
- **Repository**: `PostgresDataRepository`
- **Client**: `PostgresClient`

### Provider Factory

The `DatasetProviderFactory` service automatically selects the appropriate repository based on the dataset's provider configuration:

```typescript
// Automatic provider selection
const repository = this.datasetProviderFactory.getRepository(
  datasetConfig,
  defaultProvider
);
```

### Adding New Providers

To add a new data provider:

1. **Create Repository**: Implement `IDataRepository` interface
2. **Add Provider**: Update `DatasetProviderFactory` switch statement
3. **Configure Module**: Add provider to `DataSourceModule`
4. **Update Documentation**: Add provider to supported list

### Example Configurations

#### Drupal CMS Dataset (Example)
```json
{
  "id": "cms-content-dataset",
  "query": "drupal-content-query",
  "provider": "drupal"
}
```