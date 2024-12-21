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
```

### Cloning

```bash
$ git clone https://github.com/aceiny/dz_artisan.git
```

### Installation

#### This applies to each one of the folders (freelancer dashboard , core app )

```bash
$ npm i -g @nestjs/cli && npm install
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
├── job/            # Job tracking, handles job creation, updates, and status tracking
├── message/        # Messaging system, manages chat and messages between users
├── review/         # Review system, handles user reviews and ratings
├── common/         # Shared utilities, common functions and helpers
├── config/         # Service configurations, environment variables, and settings
├── mail/           # Email service, handles sending emails
├── file/           # File management, handles file uploads and storage
└── database/       # Database module, manages database connections and queries
```

## Features

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

## Technologies Used

- TypeScript
- Node.js
- Nest.js
- class-validator
- postgresql
- uuid
- JWT
- Passport js
- bcrypt
- swagger
- cookie parser 

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
