import { Prisma, PrismaClient } from "@prisma/client";

import { env } from "~/env.mjs";

const publishedProductsExtension = Prisma.defineExtension({
  name: "publishedProducts",
  query: {
    product: {
      async findMany({ model, operation, args, query}) {
        args.where = { ...args.where, published: true }
        return query(args)
      },
      async findFirst({ model, operation, args, query}) {
        args.where = { ...args.where, published: true }
        return query(args)
      },
      async findUnique({ model, operation, args, query}) {
        args.where = { ...args.where, published: true }
        return query(args)
      },
      async count({ model, operation, args, query}) {
        args.where = { ...args.where, published: true }
        return query(args)
      },
    }
  }
})

const prismaClientExtended = new PrismaClient({}).$extends(publishedProductsExtension)

export type ExtendedPrismaClient = typeof prismaClientExtended

const globalForPrisma = globalThis as unknown as {
  prisma: ExtendedPrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  }).$extends(publishedProductsExtension)
  

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db.$extends(publishedProductsExtension)



