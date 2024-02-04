# My Resumes - Backend

This is the backend of the [My Resumes](https://github.com/raphaelmarques2/my-resumes) project.

The backend is a REST server to manage resumes and its contents.

# Technologies

These are the main technologies used on this project:

- Node
- TypeScript
- NestJS
- Jest
- Supertest
- Postgres
- Prisma
- Zod
- Docker

## Architecture and Modules

The project uses a mix of **Clean Architecture** and **Hexagonal Architecture** organizing the features in **modules**, and applying concepts of **Domain Driven Design**.

The modules are:

- common - code used by many modules
- auth - handle authentication and user entity
- education - handle each education entity a resume can have
- experience - handle each experience entity a resume can have
- profile - handle a profile entity which a user can have
- resume - handle each resume a user can have

Each feature was created as an use-case. Each usecase uses the necessary entities, DTOs, repositories and services.

## Database and Data Access

This project uses Postgress as database, hosted on Vercel.

Prisma was used to model and access the database, including the migrations.

Each entity saved on the database is accessed using the repository pattern, with memory implementations (for tests) and prisma implementations (for production)

## Validation

The **Zod** lib was used to validate all input data. The validations is made on each use-case and at a controller level using a NestJS ValidationPipe.

## Tests

Jest and Supertest are used to create automated tests.

The tests are focused on **integration tests** and **end-to-end tests**, including a only a few **unit tests**.

The **integrations tests** (.spec.ts files) were created to cover each use-case, using repositories's memory implementations including mocks when it's necessary.

The **end-to-end tests** (.test.ts files) were created for each route, using real repositories's implementations to access the database with Prisma.

This way the **integration tests** cover all features and business logic (use cases), and the **end-to-end tests** cover all the infra technologies as controllers and database access.

## Running the app

### 1. Install the dependencies

```bash
$ npm install
```

### 2. Start the database instances on Docker

The docker-compose file has two databases, one for dev, other for tests

```bash
$ docker-compose up
```

### 3. Create an .env file

Create a copy of `.env.example` file and rename it to `.env`

Set all the a env variables, except sendgrid.

### 4. Run the migrations to dev database

```bash
$ npm run prisma:migrate:deploy
```

### 5. Start the app

It will run the app at http://localhost:3001

```bash
$ npm run start:dev
```

# Running the tests

After running the app, you need to prepare the testing database

### 6. Run the migrations to test database

Use the migration command with the testing database url

Linux and MacOS:

```bash
DATABASE_URL="postgresql://user:password@localhost:5433/db" npm run prisma:migrate:deploy
```

Windows Command Prompt:

```bash
set DATABASE_URL="postgresql://user:password@localhost:5433/db" && npm run prisma:migrate:deploy
```

Windows PowerShell:

```bash
$env:DATABASE_URL="postgresql://user:password@localhost:5433/db"; npm run prisma:migrate:deploy
```

### 7. Running the tests

```bash
$ npm run test
```
