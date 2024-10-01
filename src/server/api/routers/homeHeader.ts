import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const homeHeaderRouter = createTRPCRouter({

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.homeHeader.findMany()
  }),
  getOneById: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.db.homeHeader.findUnique({
      where: {
        id: input
      }
    })
  })
});
