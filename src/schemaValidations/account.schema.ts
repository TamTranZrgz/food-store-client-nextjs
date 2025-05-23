import { Role } from "@/constants/type";
import { LoginRes } from "@/schemaValidations/auth.schema";
import z from "zod";

export const AccountSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  role: z.enum([Role.Owner, Role.Employee]),
  avatar: z.string().nullable(),
});

export const AccountListRes = z.object({
  data: z.array(AccountSchema),
  message: z.string(),
});

export const AccountRes = z
  .object({
    data: AccountSchema,
    message: z.string(),
  })
  .strict();

export const CreateEmployeeAccountBody = z
  .object({
    name: z.string().trim().min(2).max(256),
    email: z.string().email(),
    avatar: z.string().url().optional(),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Pasword does not match",
        path: ["confirmPassword"],
      });
    }
  });

export const UpdateEmployeeAccountBody = z
  .object({
    name: z.string().trim().min(2).max(256),
    email: z.string().email(),
    avatar: z.string().url().optional(),
    changePassword: z.boolean().optional(),
    password: z.string().min(6).max(100).optional(),
    confirmPassword: z.string().min(6).max(100).optional(),
    role: z.enum([Role.Owner, Role.Employee]).optional().default(Role.Employee),
  })
  .strict()
  .superRefine(({ confirmPassword, password, changePassword }, ctx) => {
    if (changePassword) {
      if (!password || !confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Please enter new password and confirm new password",
          path: ["changePassword"],
        });
      } else if (confirmPassword !== password) {
        ctx.addIssue({
          code: "custom",
          message: "Password does not match",
          path: ["confirmPassword"],
        });
      }
    }
  });

export const UpdateMeBody = z
  .object({
    name: z.string().trim().min(2).max(256),
    avatar: z.string().url().optional(),
  })
  .strict();

export const ChangePasswordBody = z
  .object({
    oldPassword: z.string().min(6).max(100),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "New password does not match",
        path: ["confirmPassword"],
      });
    }
  });

export const ChangePasswordV2Body = ChangePasswordBody;

export const ChangePasswordV2Res = LoginRes;

export const AccountIdParam = z.object({
  id: z.coerce.number(),
});

export const GetListGuestsRes = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      tableNumber: z.number().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
  message: z.string(),
});

export const GetGuestListQueryParams = z.object({
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
});

export const CreateGuestBody = z
  .object({
    name: z.string().trim().min(2).max(256),
    tableNumber: z.number(),
  })
  .strict();

export const CreateGuestRes = z.object({
  message: z.string(),
  data: z.object({
    id: z.number(),
    name: z.string(),
    role: z.enum([Role.Guest]),
    tableNumber: z.number().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
});

// TYPE EXPORT

export type AccountType = z.TypeOf<typeof AccountSchema>;

export type AccountListResType = z.TypeOf<typeof AccountListRes>;

export type AccountResType = z.TypeOf<typeof AccountRes>;

export type CreateEmployeeAccountBodyType = z.TypeOf<
  typeof CreateEmployeeAccountBody
>;

export type UpdateEmployeeAccountBodyType = z.TypeOf<
  typeof UpdateEmployeeAccountBody
>;

export type UpdateMeBodyType = z.TypeOf<typeof UpdateMeBody>;

export type ChangePasswordBodyType = z.TypeOf<typeof ChangePasswordBody>;

export type ChangePasswordV2BodyType = z.TypeOf<typeof ChangePasswordV2Body>;

export type ChangePasswordV2ResType = z.TypeOf<typeof ChangePasswordV2Res>;

export type AccountIdParamType = z.TypeOf<typeof AccountIdParam>;

export type GetListGuestsResType = z.TypeOf<typeof GetListGuestsRes>;

export type GetGuestListQueryParamsType = z.TypeOf<
  typeof GetGuestListQueryParams
>;

export type CreateGuestBodyType = z.TypeOf<typeof CreateGuestBody>;

export type CreateGuestResType = z.TypeOf<typeof CreateGuestRes>;
