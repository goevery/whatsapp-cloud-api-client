import z from "zod";

export const mediaTypeSchema = z.enum([
  "audio",
  "document",
  "image",
  "sticker",
  "video",
]);

export type MediaType = z.infer<typeof mediaTypeSchema>;

export const audioMimeTypeSchema = z.enum([
  "audio/aac",
  "audio/amr",
  "audio/mpeg",
  "audio/mp4",
  "audio/ogg",
]);

export const documentMimeTypeSchema = z.enum([
  "text/plain",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/pdf",
]);

export const imageMimeTypeSchema = z.enum(["image/jpeg", "image/png"]);

export const stickerMimeTypeSchema = z.enum(["image/webp"]);

export const videoMimeTypeSchema = z.enum(["video/3gpp", "video/mp4"]);

export const mediaMimeTypeSchema = z.union([
  audioMimeTypeSchema,
  documentMimeTypeSchema,
  imageMimeTypeSchema,
  stickerMimeTypeSchema,
  videoMimeTypeSchema,
]);

export type MediaMimeType = z.infer<typeof mediaMimeTypeSchema>;

export const uploadMediaRequestSchema = z.object({
  messaging_product: z.literal("whatsapp"),
  type: mediaMimeTypeSchema,
});

export type UploadMediaRequest = z.infer<typeof uploadMediaRequestSchema>;

export const uploadMediaResponseSchema = z.object({
  id: z.string(),
});

export type UploadMediaResponse = z.infer<typeof uploadMediaResponseSchema>;

export const getMediaUrlResponseSchema = z.object({
  messaging_product: z.literal("whatsapp"),
  url: z.string(),
  mime_type: mediaMimeTypeSchema,
  sha256: z.string(),
  file_size: z.number(),
  id: z.string(),
});

export type GetMediaUrlResponse = z.infer<typeof getMediaUrlResponseSchema>;

export const getMediaUrlRequestSchema = z.object({
  phone_number_id: z.string().optional(),
});

export type GetMediaUrlRequest = z.infer<typeof getMediaUrlRequestSchema>;

export const deleteMediaRequestSchema = z.object({
  phone_number_id: z.string().optional(),
});

export type DeleteMediaRequest = z.infer<typeof deleteMediaRequestSchema>;

export const deleteMediaResponseSchema = z.object({
  success: z.boolean(),
});

export type DeleteMediaResponse = z.infer<typeof deleteMediaResponseSchema>;
