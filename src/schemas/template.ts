import z from "zod";

export const whatsAppTemplateCategorySchema = z.enum([
  "UTILITY",
  "MARKETING",
  "AUTHENTICATION",
]);

export type WhatsAppTemplateCategory = z.infer<
  typeof whatsAppTemplateCategorySchema
>;

export const whatsAppTemplateStatusSchema = z.enum([
  "APPROVED",
  "IN_APPEAL",
  "PENDING",
  "REJECTED",
  "PENDING_DELETION",
  "DELETED",
  "DISABLED",
  "PAUSED",
  "LIMIT_EXCEEDED",
  "ARCHIVED",
]);

export const whatsAppTemplateParameterFormatSchema = z.enum([
  "NAMED",
  "POSITIONAL",
]);

export type WhatsAppTemplateParameterFormat = z.infer<
  typeof whatsAppTemplateParameterFormatSchema
>;

export const whatsAppTemplateQualityScoreSchema = z.enum([
  "GREEN",
  "YELLOW",
  "RED",
  "UNKNOWN",
]);

export type WhatsAppTemplateQualityScore = z.infer<
  typeof whatsAppTemplateQualityScoreSchema
>;

export const whatsAppTemplatedNamedParamSchema = z.object({
  param_name: z.string(),
  example: z.string(),
});

export type WhatsAppTemplateNamedParam = z.infer<
  typeof whatsAppTemplatedNamedParamSchema
>;

export const whatsAppTemplateHeaderNoParamsComponentSchema = z.object({
  type: z.literal("HEADER"),
  format: z.literal("TEXT"),
  text: z.string(),
});

export const whatsAppTemplateHeaderNamedParamsComponentSchema = z.object({
  type: z.literal("HEADER"),
  format: z.literal("TEXT"),
  text: z.string(),
  example: z.object({
    header_text_named_params: z.array(whatsAppTemplatedNamedParamSchema),
  }),
});

export const whatsAppTemplateHeaderPositionalParamsComponentSchema = z.object({
  type: z.literal("HEADER"),
  format: z.literal("TEXT"),
  text: z.string(),
  example: z.object({
    header_text: z.array(z.string()),
  }),
});

export const whatsAppTemplateHeaderLocationComponentSchema = z.object({
  type: z.literal("HEADER"),
  format: z.literal("LOCATION"),
});

export const whatsAppTemplateHeaderComponentSchema = z.union([
  whatsAppTemplateHeaderNoParamsComponentSchema,
  whatsAppTemplateHeaderNamedParamsComponentSchema,
  whatsAppTemplateHeaderPositionalParamsComponentSchema,
  whatsAppTemplateHeaderLocationComponentSchema,
]);

export type WhatsAppTemplateHeaderComponent = z.infer<
  typeof whatsAppTemplateHeaderComponentSchema
>;

export const whatsAppTemplateBodyNoParamsComponentSchema = z.object({
  type: z.literal("BODY"),
  text: z.string(),
});

export const whatsAppTemplateBodyNamedParamsComponentSchema = z.object({
  type: z.literal("BODY"),
  text: z.string(),
  example: z.object({
    body_text_named_params: z.array(whatsAppTemplatedNamedParamSchema),
  }),
});

export const whatsAppTemplateBodyPositionalParamsComponentSchema = z.object({
  type: z.literal("BODY"),
  text: z.string(),
  example: z.object({
    body_text: z.array(z.array(z.string())),
  }),
});

export const whatsAppTemplateBodyAuthComponentSchema = z.object({
  type: z.literal("BODY"),
  add_security_recommendation: z.boolean().optional(),
});

export const whatsAppTemplateBodyComponentSchema = z.union([
  whatsAppTemplateBodyNoParamsComponentSchema,
  whatsAppTemplateBodyNamedParamsComponentSchema,
  whatsAppTemplateBodyPositionalParamsComponentSchema,
  whatsAppTemplateBodyAuthComponentSchema,
]);

export type WhatsAppTemplateBodyComponent = z.infer<
  typeof whatsAppTemplateBodyComponentSchema
>;

export const whatsAppTemplateFooterComponentSchema = z.object({
  type: z.literal("FOOTER"),
  text: z.string(),
});

export const whatsAppTemplateFooterAuthComponentSchema = z.object({
  type: z.literal("FOOTER"),
  code_expiration_minutes: z.number().min(1).max(90),
});

export type WhatsAppTemplateFooterComponent = z.infer<
  typeof whatsAppTemplateFooterComponentSchema
>;

export const whatsAppTemplateQuickReplyButtonSchema = z.object({
  type: z.literal("QUICK_REPLY"),
  text: z.string(),
});

export type WhatsAppTemplateQuickReplyButton = z.infer<
  typeof whatsAppTemplateQuickReplyButtonSchema
>;

export const whatsAppTemplateOTPButtonSchema = z.object({
  type: z.literal("OTP"),
  otp_type: z.enum(["COPY_CODE", "ONE_TAP", "ZERO_TAP"]),
  supported_apps: z
    .array(
      z.object({
        package_name: z.string(),
        signature_hash: z.string(),
      }),
    )
    .optional(),
});

export type WhatsAppTemplateOTPButton = z.infer<
  typeof whatsAppTemplateOTPButtonSchema
>;

export const whatsAppTemplateButtonSchema = z.union([
  whatsAppTemplateQuickReplyButtonSchema,
  whatsAppTemplateOTPButtonSchema,
]);

export const whatsAppTemplateButtonsComponentSchema = z.object({
  type: z.literal("BUTTONS"),
  buttons: z.array(whatsAppTemplateButtonSchema),
});

export type WhatsAppTemplateButtonsComponent = z.infer<
  typeof whatsAppTemplateButtonsComponentSchema
>;

export const whatsAppTemplateFooterUnionSchema = z.union([
  whatsAppTemplateFooterComponentSchema,
  whatsAppTemplateFooterAuthComponentSchema,
]);

export const whatsAppTemplateComponentSchema = z.union([
  whatsAppTemplateBodyComponentSchema,
  whatsAppTemplateHeaderComponentSchema,
  whatsAppTemplateFooterUnionSchema,
  whatsAppTemplateButtonsComponentSchema,
]);

export type WhatsAppTemplateComponent = z.infer<
  typeof whatsAppTemplateComponentSchema
>;

export const whatsAppTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  language: z.string(),
  category: whatsAppTemplateCategorySchema,
  status: whatsAppTemplateStatusSchema,
  parameter_format: whatsAppTemplateParameterFormatSchema.optional(),
  components: z.array(whatsAppTemplateComponentSchema),
});

export type WhatsAppTemplate = z.infer<typeof whatsAppTemplateSchema>;

export const createWhatsAppTemplateRequestSchema = whatsAppTemplateSchema.omit({
  id: true,
  status: true,
});

export type CreateWhatsAppTemplateRequest = z.infer<
  typeof createWhatsAppTemplateRequestSchema
>;

export const createWhatsAppTemplateResponseSchema = z.object({
  id: z.string(),
  status: whatsAppTemplateStatusSchema,
  category: whatsAppTemplateCategorySchema,
});

export const listWhatsAppTemplatesRequestSchema = z.object({
  category: whatsAppTemplateCategorySchema.optional(),
  content: z.string().optional(),
  language: z.string().optional(),
  name: z.string().optional(),
  name_or_content: z.string().optional(),
  quality_score: whatsAppTemplateQualityScoreSchema.optional(),
  status: whatsAppTemplateStatusSchema.optional(),
});

export type ListWhatsAppTemplatesRequest = z.infer<
  typeof listWhatsAppTemplatesRequestSchema
>;

export const listWhatsAppTemplatesResponseSchema = z.object({
  data: z.array(whatsAppTemplateSchema),
  paging: z
    .object({
      cursors: z.object({
        before: z.string(),
        after: z.string(),
      }),
    })
    .optional(),
});

export type ListWhatsAppTemplatesResponse = z.infer<
  typeof listWhatsAppTemplatesResponseSchema
>;

export const deleteWhatsAppTemplateRequestSchema = z.union([
  z.object({
    name: z.string(),
  }),
  z.object({
    hsm_id: z.string(),
  }),
]);

export type DeleteWhatsAppTemplateRequest = z.infer<
  typeof deleteWhatsAppTemplateRequestSchema
>;

export const deleteWhatsAppTemplateResponseSchema = z.object({
  success: z.boolean(),
});

export type DeleteWhatsAppTemplateResponse = z.infer<
  typeof deleteWhatsAppTemplateResponseSchema
>;
