import { createTRPCRouter } from "~/server/api/trpc";
import { productRouter } from "./routers/product";
import { categoryRouter } from "./routers/category";
import { contactInfoRouter } from "./routers/contactInfo";
import { homeHeaderRouter } from "./routers/homeHeader";
import { sizeRouter } from "./routers/size";
import { colorRouter } from "./routers/color";
import { cartSessionRouter } from "./routers/cartSession";
import { orderRouter } from "./routers/order";
import { paymentRouter } from "./routers/payment";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  product: productRouter,
  category: categoryRouter,
  contactInfo: contactInfoRouter,
  homeHeader: homeHeaderRouter,
  size: sizeRouter,
  color: colorRouter,
  cartSession: cartSessionRouter,
  order: orderRouter,
  payment: paymentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
