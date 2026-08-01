import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __sitePrisma: PrismaClient | undefined;
}

export const prisma = global.__sitePrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.__sitePrisma = prisma;
}
