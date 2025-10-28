import z from "zod";

export const messageTypeSchema = z.enum([
  "text",
  "image",
  "video",
  "audio",
  "document",
  "sticker",
  "location",
  "contacts",
  "interactive",
  "template",
  "reaction",
]);

export type MessageType = z.infer<typeof messageTypeSchema>;

export const recipientTypeSchema = z.enum(["individual"]);

export type RecipientType = z.infer<typeof recipientTypeSchema>;

export const textObjectSchema = z.object({
  body: z.string().max(4096),
  preview_url: z.boolean().optional(),
});

export type TextObject = z.infer<typeof textObjectSchema>;

export const mediaObjectSchema = z.object({
  id: z.string().optional(),
  link: z.url().optional(),
  caption: z.string().max(1024).optional(),
  filename: z.string().optional(),
  provider: z.string().optional(),
});

export type MediaObject = z.infer<typeof mediaObjectSchema>;

export const reactionObjectSchema = z.object({
  message_id: z.string(),
  emoji: z.string(),
});

export type ReactionObject = z.infer<typeof reactionObjectSchema>;

export const locationObjectSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  name: z.string(),
  address: z.string(),
});

export type LocationObject = z.infer<typeof locationObjectSchema>;

export const contactAddressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
  country_code: z.string().optional(),
  type: z.enum(["HOME", "WORK"]).optional(),
});

export type ContactAddress = z.infer<typeof contactAddressSchema>;

export const contactEmailSchema = z.object({
  email: z.email().optional(),
  type: z.enum(["HOME", "WORK"]).optional(),
});

export type ContactEmail = z.infer<typeof contactEmailSchema>;

export const contactNameSchema = z.object({
  formatted_name: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  middle_name: z.string().optional(),
  suffix: z.string().optional(),
  prefix: z.string().optional(),
});

export type ContactName = z.infer<typeof contactNameSchema>;

export const contactOrgSchema = z.object({
  company: z.string().optional(),
  department: z.string().optional(),
  title: z.string().optional(),
});

export type ContactOrg = z.infer<typeof contactOrgSchema>;

export const contactPhoneSchema = z.object({
  phone: z.string().optional(),
  type: z.enum(["CELL", "MAIN", "IPHONE", "HOME", "WORK"]).optional(),
  wa_id: z.string().optional(),
});

export type ContactPhone = z.infer<typeof contactPhoneSchema>;

export const contactUrlSchema = z.object({
  url: z.url().optional(),
  type: z.enum(["HOME", "WORK"]).optional(),
});

export type ContactUrl = z.infer<typeof contactUrlSchema>;

export const contactSchema = z.object({
  addresses: z.array(contactAddressSchema).optional(),
  birthday: z.string().optional(),
  emails: z.array(contactEmailSchema).optional(),
  name: contactNameSchema,
  org: contactOrgSchema.optional(),
  phones: z.array(contactPhoneSchema).optional(),
  urls: z.array(contactUrlSchema).optional(),
});

export type Contact = z.infer<typeof contactSchema>;

export const contactsObjectSchema = z.array(contactSchema);

export type ContactsObject = z.infer<typeof contactsObjectSchema>;

export const interactiveHeaderTextSchema = z.object({
  type: z.literal("text"),
  text: z.string().max(60),
  sub_text: z.string().max(60).optional(),
});

export const interactiveHeaderImageSchema = z.object({
  type: z.literal("image"),
  image: mediaObjectSchema,
});

export const interactiveHeaderVideoSchema = z.object({
  type: z.literal("video"),
  video: mediaObjectSchema,
});

export const interactiveHeaderDocumentSchema = z.object({
  type: z.literal("document"),
  document: mediaObjectSchema,
});

export const interactiveHeaderGifSchema = z.object({
  type: z.literal("gif"),
  gif: mediaObjectSchema,
});

export const interactiveHeaderSchema = z.union([
  interactiveHeaderTextSchema,
  interactiveHeaderImageSchema,
  interactiveHeaderVideoSchema,
  interactiveHeaderDocumentSchema,
  interactiveHeaderGifSchema,
]);

export type InteractiveHeader = z.infer<typeof interactiveHeaderSchema>;

export const interactiveBodySchema = z.object({
  text: z.string().max(1024),
});

export type InteractiveBody = z.infer<typeof interactiveBodySchema>;

export const interactiveFooterSchema = z.object({
  text: z.string().max(60),
});

export type InteractiveFooter = z.infer<typeof interactiveFooterSchema>;

export const interactiveReplyButtonSchema = z.object({
  type: z.literal("reply"),
  reply: z.object({
    id: z.string().max(256),
    title: z.string().max(20),
  }),
});

export type InteractiveReplyButton = z.infer<
  typeof interactiveReplyButtonSchema
>;

export const interactiveActionButtonsSchema = z.object({
  buttons: z.array(interactiveReplyButtonSchema).min(1).max(3),
});

export const interactiveListRowSchema = z.object({
  id: z.string().max(200),
  title: z.string().max(24),
  description: z.string().max(72).optional(),
});

export type InteractiveListRow = z.infer<typeof interactiveListRowSchema>;

export const interactiveListSectionSchema = z.object({
  title: z.string().max(24).optional(),
  rows: z.array(interactiveListRowSchema).min(1).max(10),
});

export type InteractiveListSection = z.infer<
  typeof interactiveListSectionSchema
>;

export const interactiveActionListSchema = z.object({
  button: z.string().max(20),
  sections: z.array(interactiveListSectionSchema).min(1).max(10),
});

export const interactiveActionProductSchema = z.object({
  catalog_id: z.string(),
  product_retailer_id: z.string(),
});

export const interactiveProductItemSchema = z.object({
  product_retailer_id: z.string(),
});

export type InteractiveProductItem = z.infer<
  typeof interactiveProductItemSchema
>;

export const interactiveProductSectionSchema = z.object({
  title: z.string().max(24).optional(),
  product_items: z.array(interactiveProductItemSchema).min(1).max(30),
});

export type InteractiveProductSection = z.infer<
  typeof interactiveProductSectionSchema
>;

export const interactiveActionProductListSchema = z.object({
  catalog_id: z.string(),
  sections: z.array(interactiveProductSectionSchema).min(1).max(10),
});

export const interactiveActionCatalogSchema = z.object({
  name: z.literal("catalog_message"),
  parameters: z.object({
    thumbnail_product_retailer_id: z.string(),
  }),
});

export const interactiveActionFlowSchema = z.object({
  name: z.literal("flow"),
  parameters: z.object({
    flow_message_version: z.literal("3"),
    flow_id: z.string().optional(),
    flow_name: z.string().optional(),
    flow_cta: z.string(),
    mode: z.enum(["draft", "published"]).optional(),
    flow_token: z.string().optional(),
    flow_action: z.enum(["navigate", "data_exchange"]).optional(),
    flow_action_payload: z
      .object({
        screen: z.string().optional(),
        data: z.record(z.string(), z.any()).optional(),
      })
      .optional(),
  }),
});

export const interactiveActionCallPermissionSchema = z.object({
  name: z.literal("call_permission_request"),
});

export const interactiveButtonSchema = z.object({
  type: z.literal("button"),
  header: interactiveHeaderSchema.optional(),
  body: interactiveBodySchema,
  footer: interactiveFooterSchema.optional(),
  action: interactiveActionButtonsSchema,
});

export type InteractiveButton = z.infer<typeof interactiveButtonSchema>;

export const interactiveListSchema = z.object({
  type: z.literal("list"),
  header: interactiveHeaderSchema.optional(),
  body: interactiveBodySchema,
  footer: interactiveFooterSchema.optional(),
  action: interactiveActionListSchema,
});

export type InteractiveList = z.infer<typeof interactiveListSchema>;

export const interactiveProductSchema = z.object({
  type: z.literal("product"),
  body: interactiveBodySchema.optional(),
  footer: interactiveFooterSchema.optional(),
  action: interactiveActionProductSchema,
});

export type InteractiveProduct = z.infer<typeof interactiveProductSchema>;

export const interactiveProductListSchema = z.object({
  type: z.literal("product_list"),
  header: interactiveHeaderTextSchema,
  body: interactiveBodySchema,
  footer: interactiveFooterSchema.optional(),
  action: interactiveActionProductListSchema,
});

export type InteractiveProductList = z.infer<
  typeof interactiveProductListSchema
>;

export const interactiveCatalogSchema = z.object({
  type: z.literal("catalog_message"),
  body: interactiveBodySchema,
  footer: interactiveFooterSchema.optional(),
  action: interactiveActionCatalogSchema,
});

export type InteractiveCatalog = z.infer<typeof interactiveCatalogSchema>;

export const interactiveFlowSchema = z.object({
  type: z.literal("flow"),
  header: interactiveHeaderSchema.optional(),
  body: interactiveBodySchema,
  footer: interactiveFooterSchema.optional(),
  action: interactiveActionFlowSchema,
});

export type InteractiveFlow = z.infer<typeof interactiveFlowSchema>;

export const interactiveCallPermissionSchema = z.object({
  type: z.literal("call_permission_request"),
  body: interactiveBodySchema,
  action: interactiveActionCallPermissionSchema,
});

export type InteractiveCallPermission = z.infer<
  typeof interactiveCallPermissionSchema
>;

export const interactiveObjectSchema = z.union([
  interactiveButtonSchema,
  interactiveListSchema,
  interactiveProductSchema,
  interactiveProductListSchema,
  interactiveCatalogSchema,
  interactiveFlowSchema,
  interactiveCallPermissionSchema,
]);

export type InteractiveObject = z.infer<typeof interactiveObjectSchema>;

export const templateLanguageSchema = z.object({
  policy: z.literal("deterministic"),
  code: z.string(),
});

export type TemplateLanguage = z.infer<typeof templateLanguageSchema>;

export const templateCurrencySchema = z.object({
  fallback_value: z.string(),
  code: z.string(),
  amount_1000: z.number(),
});

export type TemplateCurrency = z.infer<typeof templateCurrencySchema>;

export const templateDateTimeSchema = z.object({
  fallback_value: z.string(),
});

export type TemplateDateTime = z.infer<typeof templateDateTimeSchema>;

export const templateParameterSchema = z.union([
  z.object({
    type: z.literal("text"),
    text: z.string(),
  }),
  z.object({
    type: z.literal("currency"),
    currency: templateCurrencySchema,
  }),
  z.object({
    type: z.literal("date_time"),
    date_time: templateDateTimeSchema,
  }),
  z.object({
    type: z.literal("image"),
    image: mediaObjectSchema,
  }),
  z.object({
    type: z.literal("document"),
    document: mediaObjectSchema,
  }),
  z.object({
    type: z.literal("video"),
    video: mediaObjectSchema,
  }),
]);

export type TemplateParameter = z.infer<typeof templateParameterSchema>;

export const templateButtonParameterSchema = z.union([
  z.object({
    type: z.literal("payload"),
    payload: z.string(),
  }),
  z.object({
    type: z.literal("text"),
    text: z.string(),
  }),
]);

export type TemplateButtonParameter = z.infer<
  typeof templateButtonParameterSchema
>;

export const templateComponentSchema = z.union([
  z.object({
    type: z.literal("header"),
    parameters: z.array(templateParameterSchema),
  }),
  z.object({
    type: z.literal("body"),
    parameters: z.array(templateParameterSchema),
  }),
  z.object({
    type: z.literal("button"),
    sub_type: z.enum(["quick_reply", "url", "catalog"]),
    index: z.number().int().min(0).max(9),
    parameters: z.array(templateButtonParameterSchema),
  }),
]);

export type TemplateComponent = z.infer<typeof templateComponentSchema>;

export const templateObjectSchema = z.object({
  name: z.string(),
  language: templateLanguageSchema,
  components: z.array(templateComponentSchema).optional(),
  namespace: z.string().optional(), // On-Premises API only
});

export type TemplateObject = z.infer<typeof templateObjectSchema>;

export const contextObjectSchema = z.object({
  message_id: z.string(),
});

export type ContextObject = z.infer<typeof contextObjectSchema>;

const baseMessageSchema = z.object({
  messaging_product: z.literal("whatsapp"),
  recipient_type: recipientTypeSchema.optional(),
  to: z.string(),
  context: contextObjectSchema.optional(),
  biz_opaque_callback_data: z.string().max(512).optional(),
  message_activity_sharing: z.boolean().optional(),
  status: z.string().optional(),
});

export const textMessageSchema = baseMessageSchema.extend({
  type: z.literal("text"),
  text: textObjectSchema,
});

export type TextMessage = z.infer<typeof textMessageSchema>;

export const imageMessageSchema = baseMessageSchema.extend({
  type: z.literal("image"),
  image: mediaObjectSchema,
});

export type ImageMessage = z.infer<typeof imageMessageSchema>;

export const videoMessageSchema = baseMessageSchema.extend({
  type: z.literal("video"),
  video: mediaObjectSchema,
});

export type VideoMessage = z.infer<typeof videoMessageSchema>;

export const audioMessageSchema = baseMessageSchema.extend({
  type: z.literal("audio"),
  audio: mediaObjectSchema,
});

export type AudioMessage = z.infer<typeof audioMessageSchema>;

export const documentMessageSchema = baseMessageSchema.extend({
  type: z.literal("document"),
  document: mediaObjectSchema,
});

export type DocumentMessage = z.infer<typeof documentMessageSchema>;

export const stickerMessageSchema = baseMessageSchema.extend({
  type: z.literal("sticker"),
  sticker: mediaObjectSchema,
});

export type StickerMessage = z.infer<typeof stickerMessageSchema>;

export const locationMessageSchema = baseMessageSchema.extend({
  type: z.literal("location"),
  location: locationObjectSchema,
});

export type LocationMessage = z.infer<typeof locationMessageSchema>;

export const contactsMessageSchema = baseMessageSchema.extend({
  type: z.literal("contacts"),
  contacts: contactsObjectSchema,
});

export type ContactsMessage = z.infer<typeof contactsMessageSchema>;

export const interactiveMessageSchema = baseMessageSchema.extend({
  type: z.literal("interactive"),
  interactive: interactiveObjectSchema,
});

export type InteractiveMessage = z.infer<typeof interactiveMessageSchema>;

export const templateMessageSchema = baseMessageSchema.extend({
  type: z.literal("template"),
  template: templateObjectSchema,
});

export type TemplateMessage = z.infer<typeof templateMessageSchema>;

export const reactionMessageSchema = baseMessageSchema.extend({
  type: z.literal("reaction"),
  reaction: reactionObjectSchema,
});

export type ReactionMessage = z.infer<typeof reactionMessageSchema>;

export const messageSchema = z.union([
  textMessageSchema,
  imageMessageSchema,
  videoMessageSchema,
  audioMessageSchema,
  documentMessageSchema,
  stickerMessageSchema,
  locationMessageSchema,
  contactsMessageSchema,
  interactiveMessageSchema,
  templateMessageSchema,
  reactionMessageSchema,
]);

export type Message = z.infer<typeof messageSchema>;

export const sendMessageRequestSchema = messageSchema;

export type SendMessageRequest = z.infer<typeof sendMessageRequestSchema>;

export const sendMessageResponseSchema = z.object({
  messaging_product: z.literal("whatsapp"),
  contacts: z.array(
    z.object({
      input: z.string(),
      wa_id: z.string(),
    }),
  ),
  messages: z.array(
    z.object({
      id: z.string(),
      message_status: z
        .enum(["accepted", "held_for_quality_assessment"])
        .optional(),
    }),
  ),
});

export type SendMessageResponse = z.infer<typeof sendMessageResponseSchema>;

export const markMessageAsReadRequestSchema = z.object({
  messaging_product: z.literal("whatsapp"),
  status: z.literal("read"),
  message_id: z.string(),
});

export type MarkMessageAsReadRequest = z.infer<
  typeof markMessageAsReadRequestSchema
>;

export const markMessageAsReadResponseSchema = z.object({
  success: z.boolean(),
});

export type MarkMessageAsReadResponse = z.infer<
  typeof markMessageAsReadResponseSchema
>;
