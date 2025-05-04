import z from "zod";

export const MessageRes = z
  .object({
    message: z.string(),
  })
  .strict();

// TYPE EXPORT

export type MessageResType = z.TypeOf<typeof MessageRes>;
