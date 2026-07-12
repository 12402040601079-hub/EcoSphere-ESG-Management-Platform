# Implementation Plan: EcoSphere Backend

Since we are skipping the line-by-line teaching phase, I will take the lead on scaffolding and building out the backend architecture. 

## Goal
Build out the foundational NestJS modules, integrate the provided Prisma schema, and implement the core authentication layer.

## User Review Required
> [!IMPORTANT]
> The database schema was created in `database/schema.prisma`, but Prisma usually expects it inside the `backend/prisma/` directory to generate the client properly for the NestJS application. 
> **My proposed change is to copy the schema from `database/` into `backend/prisma/` and install the required dependencies directly into the `backend` project.**

## Proposed Changes

### 1. Dependency Installation
I will install the following packages in the `backend` project:
- **Database**: `@prisma/client`, `prisma` (dev)
- **Validation**: `class-validator`, `class-transformer`
- **Authentication**: `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `bcrypt`, and their types.
- **Events/Jobs**: `@nestjs/event-emitter`

### 2. Prisma Integration
- Copy `database/schema.prisma` to `backend/prisma/schema.prisma`.
- Generate the Prisma Client (`npx prisma generate`).
- Create a `PrismaModule` and `PrismaService` to handle database connections globally.

### 3. Core Module Scaffolding
I will generate the following modules, controllers, and services using the NestJS CLI:
- `AuthModule`: For login, registration, and JWT generation.
- `AdminModule`: For managing departments, users, and emission factors.
- `EnvironmentalModule`: For carbon transactions.
- `SocialModule`: For CSR activities.
- `GovernanceModule`: For compliance issues and policies.
- `GamificationModule`: For challenges and badges.

### 4. Auth Layer Implementation
- Implement `JwtStrategy` and `JwtAuthGuard`.
- Implement `RolesGuard` for Role-Based Access Control (RBAC).
- Create a basic `login` endpoint that returns a JWT token.

## Verification Plan

### Automated Tests
- I will run `npm run build` inside the `backend` directory to ensure the TypeScript compiles without errors.
- I will run `npm run test` to verify the module DI (Dependency Injection) graph is wired correctly.

### Manual Verification
- We will review the generated folder structure inside `backend/src`.
