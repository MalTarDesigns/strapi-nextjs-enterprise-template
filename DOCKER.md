# Docker Development Guide

This guide explains how to use Docker Compose for local development with Postgres and Strapi.

## Quick Start

1. **Copy environment variables:**
   ```bash
   cp .env.example .env
   ```

2. **Start the database and Strapi:**
   ```bash
   docker compose up -d
   ```

3. **Access services:**
   - Strapi Admin: http://localhost:1337/admin
   - PostgreSQL: localhost:5432
   - Next.js Web (if enabled): http://localhost:3000

## Service Profiles

### Default Profile (Database + Strapi)
```bash
docker compose up -d
```
Starts: `db`, `strapi`

### Database Only
```bash
docker compose up -d db
```
Use this when running Strapi locally with `pnpm dev:strapi`

### Full-Stack Profile (All Services)
```bash
docker compose --profile full-stack up -d
```
Starts: `db`, `strapi`, `web`, `redis`

### Web Profile (Frontend Development)
```bash
docker compose --profile web up -d
```
Starts: `db`, `strapi`, `web`

### With Redis Cache
```bash
docker compose --profile redis up -d
```
Starts: `db`, `strapi`, `redis`

## Development Workflow

### Option 1: Hybrid Development (Recommended)
- Database in Docker: `docker compose up -d db`
- Strapi locally: `pnpm dev:strapi`
- Next.js locally: `pnpm dev:web`

Benefits: Fast hot-reload, easy debugging, access to local tools

### Option 2: Full Docker Development
- All services in Docker: `docker compose --profile full-stack up -d`
- Volume mounts enable hot-reload for code changes

### Option 3: Database + Strapi in Docker
- Database and Strapi: `docker compose up -d`
- Next.js locally: `pnpm dev:web`

## Environment Configuration

### Required Environment Variables
Copy `.env.example` to `.env` and configure:

```bash
# Database
DATABASE_USERNAME=admin
DATABASE_PASSWORD=mFm8z7z8
DATABASE_NAME=strapi-db

# Strapi Keys (generate new ones for production)
APP_KEYS=your-app-keys
ADMIN_JWT_SECRET=your-admin-secret
JWT_SECRET=your-jwt-secret
```

### Generating New Secrets
```bash
# Generate a new secret
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"

# Generate multiple APP_KEYS
node -e "console.log(Array(4).fill(0).map(() => require('crypto').randomBytes(16).toString('base64')).join(','))"
```

## Container Management

### View running containers
```bash
docker compose ps
```

### View logs
```bash
# All services
docker compose logs

# Specific service
docker compose logs strapi
docker compose logs db

# Follow logs in real-time
docker compose logs -f strapi
```

### Stop services
```bash
# Stop all services
docker compose down

# Stop and remove volumes (CAUTION: This deletes database data)
docker compose down -v
```

### Restart specific service
```bash
docker compose restart strapi
```

## Database Management

### Access PostgreSQL directly
```bash
# Using docker compose
docker compose exec db psql -U admin -d strapi-db

# Or connect from host
psql -h localhost -p 5432 -U admin -d strapi-db
```

### Database persistence
- Data is stored in the `postgres_data` Docker volume
- To reset database: `docker compose down -v` (⚠️ This deletes all data)

### Backup and restore
```bash
# Backup
docker compose exec db pg_dump -U admin strapi-db > backup.sql

# Restore
cat backup.sql | docker compose exec -T db psql -U admin -d strapi-db
```

## Troubleshooting

### Port conflicts
If ports 5432, 1337, or 3000 are in use:

**Windows (Git Bash):**
```bash
# Find process using port
netstat -ano | findstr :5432

# Kill process by PID
taskkill //PID [PID_NUMBER] //F
```

**Mac/Linux:**
```bash
# Find and kill process on port
lsof -ti:5432 | xargs kill -9
```

### Permission issues (Mac/Linux)
```bash
# Fix volume permissions
sudo chown -R $USER:$USER ./data
```

### Container won't start
1. Check logs: `docker compose logs [service-name]`
2. Verify environment variables in `.env`
3. Ensure ports aren't in use
4. Try rebuilding: `docker compose build --no-cache [service-name]`

### Database connection issues
1. Ensure database is healthy: `docker compose ps`
2. Check database logs: `docker compose logs db`
3. Verify environment variables match between services
4. Test connection: `docker compose exec db pg_isready -U admin`

## Production Considerations

### Security
- Generate new secrets for all JWT tokens and API keys
- Use strong database passwords
- Configure proper CORS origins
- Enable SSL/HTTPS

### Environment Variables
```bash
# Production overrides
NODE_ENV=production
DATABASE_SSL=true
APP_URL=https://your-api-domain.com
CLIENT_URL=https://your-app-domain.com
```

### Performance
- Use production Docker images
- Configure proper resource limits
- Enable Redis for caching
- Use CDN for static assets

## Useful Commands

```bash
# Remove all unused Docker resources
docker system prune -a

# View Docker volume usage
docker volume ls
docker volume inspect strapi-next-starter_postgres_data

# Access container shell
docker compose exec strapi sh
docker compose exec db sh

# Run pnpm commands in container
docker compose exec strapi pnpm run generate:types
docker compose exec web pnpm build
```

## Next Steps

1. Configure your Strapi admin user: http://localhost:1337/admin
2. Set up your content types and API endpoints
3. Configure Next.js to consume Strapi API
4. Set up authentication and permissions
5. Configure file uploads (local or S3)
6. Set up email providers for user registration