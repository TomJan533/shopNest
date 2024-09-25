# shopNest
Simple E-commerce shop build with NestJS, Prisma ORM, PostgreSQL, MedusaJS

## Project Structure

.
├── backend
│ ├── src # Source code for the NestJS backend
│ ├── tests # Tests folder
│ │ ├── unit # Unit tests
│ │ ├── integration # Integration tests
│ │ └── e2e # End-to-end tests
├── frontend # Empty folder for frontend implementation
├── docker-compose.yml
├── .env # Environment variables for project (PostgreSQL connection details)
└── README.md # This documentation

## Tools and Technologies Used

NestJS: Backend framework for building scalable server-side applications.
PrismaORM: ORM for type-safe database interaction.
PostgreSQL: Relational database.
Docker: Containerization platform to ensure a consistent development environment.
Jest: Testing framework.
Medusa.js: Headless e-commerce platform integrated as a main feature.
Swagger: API documentation.


## Database migrations

Use dotenv installed globally in order to migrate databases defined by multiple .env files:

```bash
npm install -g dotenv-cli
npx dotenv -e .env -- npx prisma migrate dev
npx dotenv -e .env.test -- npx prisma migrate dev
```