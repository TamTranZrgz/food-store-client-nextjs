import z from "zod";

export const UploadImageRes = z.object({
  data: z.string(),
  message: z.string(),
});

// TYPE EXPORT

export type UploadImageResType = z.TypeOf<typeof UploadImageRes>;
