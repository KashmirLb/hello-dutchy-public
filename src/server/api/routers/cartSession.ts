import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const cartSessionRouter = createTRPCRouter({


  // get or create a cart session using the sessionId
  createCartSession: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {

    const cartSession = await ctx.db.cartSession.findFirst({
      where: {
        sessionId: input
      }
    })
    if(cartSession){
      return cartSession;
    }else{
      const newCartSession = await ctx.db.cartSession.create({
        data: {
          sessionId: input,
          cartItems: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      return newCartSession;
    }
  }),

  getCartSession: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const cartSession = await ctx.db.cartSession.findFirst({
      where: {
        sessionId: input
      }
    })
    if(cartSession){
      return cartSession;
    }else{
      return null;
    }
  }),

  createOrUpdateCartSession: publicProcedure.input(z.object({
    sessionId: z.string(),
    cartItems: z.array(z.object({
      productId: z.number(),
      color: z.string(),
      colorCode: z.string(),
      colorHex: z.string(),
      size: z.string(),
      price: z.number(),
      image: z.string(),
      quantity: z.number()
    }))
  })).mutation(async ({ ctx, input }) => {

    const cartSession = await ctx.db.cartSession.upsert({
      where: {
        sessionId: input.sessionId
      },
      update: {
        cartItems: input.cartItems        
      },
      create: {
        sessionId: input.sessionId,
        cartItems: input.cartItems,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    return cartSession;
  }),
});
