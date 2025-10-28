import z from "zod";

export const whatsAppTemplatedNamedParamSchema = z.object({
  param_name: z.string(),
  example: z.string(),
});

export type WhatsAppTemplateNamedParam = z.infer<
  typeof whatsAppTemplatedNamedParamSchema
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

export const whatsAppTemplateBodyComponentSchema = z.union([
  whatsAppTemplateBodyNoParamsComponentSchema,
  whatsAppTemplateBodyNamedParamsComponentSchema,
  whatsAppTemplateBodyPositionalParamsComponentSchema,
]);

export type WhatsAppTemplateBodyComponent = z.infer<
  typeof whatsAppTemplateBodyComponentSchema
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

export const whatsAppTemplateHeaderComponentSchema = z.union([
  whatsAppTemplateHeaderNoParamsComponentSchema,
  whatsAppTemplateHeaderNamedParamsComponentSchema,
  whatsAppTemplateHeaderPositionalParamsComponentSchema,
]);

export type WhatsAppTemplateHeaderComponent = z.infer<
  typeof whatsAppTemplateHeaderComponentSchema
>;

export const whatsAppTemplateFooterComponentSchema = z.object({
  type: z.literal("FOOTER"),
  text: z.string(),
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

export const whatsAppTemplateButtonsComponentSchema = z.object({
  type: z.literal("BUTTONS"),
  buttons: z.array(whatsAppTemplateQuickReplyButtonSchema),
});

export type WhatsAppTemplateButtonsComponent = z.infer<
  typeof whatsAppTemplateButtonsComponentSchema
>;

export const whatsAppTemplateComponentSchema = z.union([
  whatsAppTemplateBodyComponentSchema,
  whatsAppTemplateHeaderComponentSchema,
  whatsAppTemplateFooterComponentSchema,
  whatsAppTemplateButtonsComponentSchema,
]);

export type WhatsAppTemplateComponent = z.infer<
  typeof whatsAppTemplateComponentSchema
>;

export const whatsAppTemplateCategorySchema = z.enum([
  "UTILITY",
  "MARKETING",
  "AUTHENTICATION",
]);

export type WhatsAppTemplateCategory = z.infer<
  typeof whatsAppTemplateCategorySchema
>;

export const whatsAppTemplateParameterFormatSchema = z.enum([
  "NAMED",
  "POSITIONAL",
]);

export type WhatsAppTemplateParameterFormat = z.infer<
  typeof whatsAppTemplateParameterFormatSchema
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

export const whatsAppTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  language: z.string(),
  category: whatsAppTemplateCategorySchema,
  parameter_format: whatsAppTemplateParameterFormatSchema.optional(),
  components: z.array(whatsAppTemplateComponentSchema),
});

export type WhatsAppTemplate = z.infer<typeof whatsAppTemplateSchema>;

export const createWhatsAppTemplateRequestSchema = whatsAppTemplateSchema.omit({
  id: true,
});

export type CreateWhatsAppTemplateRequest = z.infer<
  typeof createWhatsAppTemplateRequestSchema
>;

export const createWhatsAppTemplateResponseSchema = z.object({
  id: z.string(),
  status: whatsAppTemplateStatusSchema,
  category: whatsAppTemplateCategorySchema,
});
