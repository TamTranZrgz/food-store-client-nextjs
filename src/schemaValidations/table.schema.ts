import { TableStatusValues } from "@/constants/type";
import z from "zod";

export const CreateTableBody = z.object({
  number: z.coerce.number().positive(),
  capacity: z.coerce.number().positive(),
  status: z.enum(TableStatusValues).optional(),
});

export const TableSchema = z.object({
  number: z.coerce.number(),
  capacity: z.coerce.number(),
  status: z.enum(TableStatusValues),
  token: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const TableRes = z.object({
  data: TableSchema,
  message: z.string(),
});

export const TableListRes = z.object({
  data: z.array(TableSchema),
  message: z.string(),
});

export const UpdateTableBody = z.object({
  changeToken: z.boolean(),
  capacity: z.coerce.number().positive(),
  status: z.enum(TableStatusValues).optional(),
});

export const TableParams = z.object({
  number: z.coerce.number(),
});

// TYPE EXPORT

export type CreateTableBodyType = z.TypeOf<typeof CreateTableBody>;

export type TableResType = z.TypeOf<typeof TableRes>;

export type TableListResType = z.TypeOf<typeof TableListRes>;

export type UpdateTableBodyType = z.TypeOf<typeof UpdateTableBody>;

export type TableParamsType = z.TypeOf<typeof TableParams>;
