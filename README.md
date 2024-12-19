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
JWT_SECRET=your_JWT_secret
DB_HOST=your_database_host
DB_PORT=5432 // default port for postgres
DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
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
├── artisans/       # Artisan management
├── quotes/         # Quote system
├── jobs/           # Job tracking
├── users/          # User management
├── messages/       # Messaging system
├── reviews/        # Review system
└── common/         # Shared utilities
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
3. Deployment to cloud platforms

## License

MIT

## Contributors

- Ahmed Yassine Zeraibi , yzeraibi2000@gmail.com
