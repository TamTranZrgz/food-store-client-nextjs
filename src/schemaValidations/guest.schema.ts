import { Role } from "@/constants/type";
import { OrderSchema } from "@/schemaValidations/order.schema";
import z from "zod";

export const GuestLoginBody = z
  .object({
    name: z.string().min(2).max(50),
    tableNumber: z.number(),
    token: z.string(),
  })
  .strict();

export const GuestLoginRes = z.object({
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    guest: z.object({
      id: z.number(),
      name: z.string(),
      role: z.enum([Role.Guest]),
      tableNumber: z.number().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    }),
  }),
  message: z.string(),
});

export const GuestCreateOrdersBody = z.array(
  z.object({
    dishId: z.number(),
    quantity: z.number(),
  })
);

export const GuestCreateOrdersRes = z.object({
  message: z.string(),
  data: z.array(OrderSchema),
});

export const GuestGetOrdersRes = GuestCreateOrdersRes;

// TYPE EXPORT

export type GuestLoginBodyType = z.TypeOf<typeof GuestLoginBody>;

export type GuestLoginResType = z.TypeOf<typeof GuestLoginRes>;

export type GuestCreateOrdersBodyType = z.TypeOf<typeof GuestCreateOrdersBody>;

export type GuestCreateOrdersResType = z.TypeOf<typeof GuestCreateOrdersRes>;

export type GuestGetOrdersResType = z.TypeOf<typeof GuestGetOrdersRes>;
