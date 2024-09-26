# shopNest
Simple E-commerce shop build with NestJS, Prisma ORM, PostgreSQL

![CI](https://github.com/TomJan533/shopNest/actions/workflows/ci.yml/badge.svg)


## Project Structure

```bash
.
├── .github # CI workflow
├── backend
│ ├── prisma
│ ├── src # Source code for the NestJS backend
│ ├── tests
│ │ ├── unit
│ │ ├── integration
│ │ └── e2e
│ └── Dockerfile # Nest JS Api docker definition
├── frontend
├── docker-compose.yml
├── .env
└── README.md
```

## Tools and Technologies Used

- **NestJS**: Backend framework for building scalable server-side applications
- **PrismaORM**: ORM for type-safe database interaction
- **PostgreSQL**: Relational database
- **Docker**: Containerization platform to ensure a consistent development environment.
- **Jest**: Testing framework
- **Swagger**: API documentation
