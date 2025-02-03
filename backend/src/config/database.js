// backend/src/config/database.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default prisma;

// backend/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  role      Role     @default(USER)
}

enum Role {
  USER
  ADMIN
}