import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const productRouter = createTRPCRouter({

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.product.findMany({
        include: {
            category: true,
            images: {
              orderBy: {
                imageOrder: "asc"
              }
            }
        }
    })
  }),
  getOneById: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.db.product.findUnique({
      where: {
        id: input
      },
      include: {
        category: true,
        images: true,
        colors: {
          include: {
            color: true
          }
        },
        sizes: {
          include: {
            size: true
          }
        }
      }
    })
  })
});
