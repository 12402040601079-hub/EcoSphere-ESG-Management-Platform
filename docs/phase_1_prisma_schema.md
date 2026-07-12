# Phase 1: Database Schema (Foundation)

The backend is **not** done yet! We just created an empty folder with boilerplate files. Now we have to write the actual logic. 

Every NestJS backend that uses Prisma needs a `schema.prisma` file. This file tells the ORM exactly what our database tables look like so it can generate TypeScript types for us.

Here is the code for the first three tables we need: `Organization`, `Department`, and `User`.

```prisma
// 1. This tells Prisma how to connect to our database.
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 2. This tells Prisma to generate the TypeScript client.
generator client {
  provider = "prisma-client-js"
}

// 3. ENUM definition: Restricts the 'role' column to only these 3 specific values.
enum Role {
  ADMIN
  DEPARTMENT_HEAD
  EMPLOYEE
}

// 4. ORGANIZATION MODEL
model Organization {
  id          String       @id @default(uuid()) // Primary key, auto-generates a UUID
  name        String       @unique              // Cannot have two orgs with the same name
  departments Department[]                      // One-to-Many: An org has many departments
  users       User[]                            // One-to-Many: An org has many users
  createdAt   DateTime     @default(now())      // Auto-sets to current time on creation
}

// 5. DEPARTMENT MODEL
model Department {
  id             String       @id @default(uuid())
  name           String
  
  // 6. Foreign Key to Organization
  organization   Organization @relation(fields: [organizationId], references: [id])
  organizationId String

  // 7. Self-Referencing Relation (For Department Hierarchy)
  parentDept     Department?  @relation("DeptHierarchy", fields: [parentDeptId], references: [id])
  parentDeptId   String?
  subDepts       Department[] @relation("DeptHierarchy")

  users          User[]       // One-to-Many: A department has many users
}

// 8. USER MODEL
model User {
  id             String       @id @default(uuid())
  email          String       @unique
  passwordHash   String       // We never store plain text passwords!
  role           Role         @default(EMPLOYEE)
  xpTotal        Int          @default(0)
  
  // 9. Foreign Keys linking User to Org and Dept
  organization   Organization @relation(fields: [organizationId], references: [id])
  organizationId String
  
  department     Department   @relation(fields: [departmentId], references: [id])
  departmentId   String
}
```

## Line-by-Line Explanation
- **Lines 1-4**: `datasource db` tells the application to look at our `.env` file for a variable named `DATABASE_URL` which holds the connection string to PostgreSQL.
- **Lines 11-15**: `enum Role` defines the RBAC (Role-Based Access Control) levels. It ensures nobody can accidentally save a user role as "SUPERVISOR" if it's not in the enum.
- **Line 20**: `departments Department[]` is a Prisma relationship. It doesn't create a column in the database; instead, it allows us to easily fetch all departments belonging to an organization in our TypeScript code.
- **Lines 31-33**: The `parentDept` relationship is how we handle hierarchical departments (e.g., "HR" is a parent of "Recruiting"). The `?` means it is nullable (optional) because top-level departments don't have a parent.
- **Line 41**: `passwordHash String`. We never, ever store passwords like "password123". We will use `bcrypt` later in our Auth module to hash this string.

---

## 📝 Phase 1 Quiz (Let's see if you got it!)

**Question 1:** Why do we use an `enum` for the User Role instead of just a standard `String` type?
**Question 2:** In the Department model, why is there a `?` after `parentDeptId String?`
**Question 3:** True or False: `departments Department[]` creates an array column in the PostgreSQL database.

*Reply with your answers to proceed!*
