import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const colorRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.color.findMany({

    })
  }),
 
});
