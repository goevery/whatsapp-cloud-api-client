import z from "zod";

export const whatsAppErrorResponseSchema = z.looseObject({
  message: z.string(),
  type: z.string(),
  code: z.number(),
  error_subcode: z.number().optional(),
  error_user_title: z.string().optional(),
  error_user_msg: z.string().optional(),
});

export type WhatsAppErrorResponse = z.infer<typeof whatsAppErrorResponseSchema>;
