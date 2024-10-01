import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const categoryRouter = createTRPCRouter({

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.productCategory.findMany({
      include:{
        products: {
          include: {
            images: true
          }
        }
      }
    })
  }),
});
