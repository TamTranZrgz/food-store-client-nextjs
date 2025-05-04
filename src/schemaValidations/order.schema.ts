import { DishStatusValues, OrderStatusValues } from "@/constants/type";
import { AccountSchema } from "@/schemaValidations/account.schema";
import { TableSchema } from "@/schemaValidations/table.schema";
import z from "zod";

const DishSnapshotSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  image: z.string(),
  description: z.string(),
  status: z.enum(DishStatusValues),
  dishId: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export const OrderSchema = z.object({
  id: z.number(),
  guestId: z.number().nullable(),
  guest: z
    .object({
      id: z.number(),
      name: z.string(),
      tableNumber: z.number().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
    .nullable(),
  tableNumber: z.number().nullable(),
  dishSnapshotId: z.number(),
  dishSnapshot: DishSnapshotSchema,
  quantity: z.number(),
  orderHandlerId: z.number().nullable(),
  orderHandler: AccountSchema.nullable(),
  status: z.enum(OrderStatusValues),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UpdateOrderBody = z.object({
  status: z.enum(OrderStatusValues),
  dishId: z.number(),
  quantity: z.number(),
});

export const OrderParam = z.object({
  orderId: z.coerce.number(),
});

export const UpdateOrderRes = z.object({
  message: z.string(),
  data: OrderSchema,
});

export const GetOrdersQueryParams = z.object({
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
});

export const GetOrdersRes = z.object({
  message: z.string(),
  data: z.array(OrderSchema),
});

export const GetOrderDetailRes = z.object({
  message: z.string(),
  data: OrderSchema.extend({
    table: TableSchema,
  }),
});

export const PayGuestOrdersBody = z.object({
  guestId: z.number(),
});

export const PayGuestOrdersRes = GetOrdersRes;

export const CreateOrdersBody = z
  .object({
    guestId: z.number(),
    orders: z.array(
      z.object({
        dishId: z.number(),
        quantity: z.number(),
      })
    ),
  })
  .strict();

export const CreateOrdersRes = z.object({
  message: z.string(),
  data: z.array(OrderSchema),
});

// TYPE EXPORT

export type UpdateOrderBodyType = z.TypeOf<typeof UpdateOrderBody>;

export type OrderParamType = z.TypeOf<typeof OrderParam>;

export type UpdateOrderResType = z.TypeOf<typeof UpdateOrderRes>;

export type GetOrdersQueryParamsType = z.TypeOf<typeof GetOrdersQueryParams>;

export type GetOrdersResType = z.TypeOf<typeof GetOrdersRes>;

export type GetOrderDetailResType = z.TypeOf<typeof GetOrderDetailRes>;

export type PayGuestOrdersBodyType = z.TypeOf<typeof PayGuestOrdersBody>;

export type PayGuestOrdersResType = z.TypeOf<typeof PayGuestOrdersRes>;

export type CreateOrdersBodyType = z.TypeOf<typeof CreateOrdersBody>;

export type CreateOrdersResType = z.TypeOf<typeof CreateOrdersRes>;
