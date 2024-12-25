# DZ-Artisan - Artisan Services Platform

## About

DZ-Artisan is a platform connecting skilled artisans (plumbers, electricians, carpenters, etc.) with clients, enabling quick access to qualified professionals for various services.
This project was made with typescript , nest.js and without orm using sql raw queries

## Database schema

```bash
https://drawsql.app/teams/aceiny/diagrams/dz-artisan
```

## API Documentation

```bash
# API documentation is auto-generated using Swagger and can be accessed at:
/api
```

## Getting Started

### Prerequisites

```bash
node >= 16.x
npm >= 8.x
PostgreSQL >= 14
Redis >= 6.x
```

### Quick Start 🚀

```bash
$ git clone https://github.com/aceiny/dz_artisan.git
$ cd dz_artisan
$ npm i -g @nestjs/cli
$ npm install
cp .env.example .env    # Configure your environment variables
$ npm run start:dev
```


### Environment Variables

```bash
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE_IN=1d
JWT_COOKIE_NAME=token_cookie_name
JWT_REFRESH_SECRET=your_refresh_jwt_secret_key
JWT_REFRESH_EXPIRE_IN=7d
JWT_REFRESH_COOKIE_NAME=refresh_token_cookie_name
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
SMTP_HOST=your_smtp_host
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001
PORT=3000 || another port
```

### Running the app

```bash
# development
$ npm run start:dev or nest start --watch

# production mode
$ npm run start:prod or nest start prod
```

### Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

## Project Structure

```bash
src/
├── auth/           # Authorization system, handles user authentication and JWT strategies
├── user/           # User management, including artisan and client profiles
├── certification/  # Certification system, manages user certifications
├── experience/     # experience system, manages user experiences

├── job/            # Job tracking, handles job creation, updates, and status tracking
├── Chat/           # Chat system, manages chat and messages between users
├── review/         # Review system, handles user reviews and ratings
├── common/         # Shared utilities, common functions and helpers
├── config/         # Service configurations, environment variables, and settings
├── mail/           # Email service, handles sending emails
├── file/           # File management, handles file uploads and storage
└── database/       # Database module, manages database connections and queries
```

## Features

### Authentication
- JWT-based authentication with refresh tokens
- Role-based access control (Client/Artisan)
- Google OAuth support

### File Handling
- Secure file uploads with Multer
- Support for images, PDFs and documents
- Size and type validation

### Real-time Features  
- WebSocket-based chat system
- Real-time notifications
- Message status tracking

### Email System
- Welcome emails
- Login notifications
- Queue-based email processing with Bull

### For Artisans

- Professional profile management
- Portfolio showcase
- Certification verification
- Quote management
- Scheduling system
- Integrated billing

### For Clients

- Search qualified artisans
- Online quote requests
- Price comparison
- Real-time job tracking
- Integrated messaging
- Review system

## Security Measures

- #### Strong authentication :
  using Passport.js and guards to control access based on authentication
- #### Encryption :
  Encrypting and hashing passwords
- #### Vulnerability Prevention :
  Leverage security features built into NestJS like Helmet, which helps configure secure HTTP headers to mitigate common attacks.
- #### Input Validation :
  Validate all user-provided data to prevent unexpected inputs or malicious code injection
- #### Rate Limiting :
  Implement rate limiting to prevent brute-force attacks or denial-of-service attempts.

## Technologies Used 🛠️

### Core Framework
- **NestJS** (v10.x) - Progressive Node.js framework
- **TypeScript** (v5.x) - Type-safe development
- **Node.js** (v16+) - Runtime environment

### Database & Storage
- **PostgreSQL** (v14+) - Primary database
- **Redis** (v6+) - Caching & queue management
- **TypeORM** - ORM for database operations

### Authentication & Security
- **JWT** - Token-based authentication
- **Passport.js** - Authentication middleware
- **bcrypt** (v5.x) - Password hashing
- **helmet** - HTTP security headers
- **throttler** - Rate limiting

### Real-time & Communication
- **Socket.io** (v4.x) - WebSocket connections
- **Bull** - Queue management
- **nodemailer** - Email service

### Validation & Documentation
- **class-validator** - DTO validation
- **class-transformer** - Object transformation
- **Swagger/OpenAPI** - API documentation
- **cookie-parser** - HTTP cookie parsing

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control
- **Docker** - Containerization

### Testing
- **Jest** - Unit testing
- **Supertest** - API testing

## Contributing

1. Create feature branch
2. Commit changes
3. Open pull request
4. Follow code standards

## Testing Requirements

- Minimum 3 critical unit tests
- E2E testing with Selenium
- Documented test scenarios

## Development Methodology

- Agile/Scrum
- 2-week sprints
- Daily standups
- Role rotation every 2 sprints

## Deployment

1. Automated via GitHub Actions
2. Docker containerization
3. Deployment to personnel vps

## License

MIT

## Contributors

- Ahmed Yassine Zeraibi , yzeraibi2000@gmail.com
