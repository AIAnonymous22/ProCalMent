import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  try {
    return new PrismaClient();
  } catch {
    // During build without `prisma generate`, the client may not be available.
    // This is expected — the build will succeed on Vercel where generate runs first.
    console.warn(
      "⚠ Prisma Client not generated. Run `npx prisma generate` to enable database access."
    );
    return {} as PrismaClient;
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
