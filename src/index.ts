import type { WhatsAppHttpAdapter } from "./adapter";
import {
  createWhatsAppTemplateResponseSchema,
  listWhatsAppTemplatesResponseSchema,
  deleteWhatsAppTemplateResponseSchema,
  type CreateWhatsAppTemplateRequest,
  type ListWhatsAppTemplatesRequest,
  type DeleteWhatsAppTemplateRequest,
  sendMessageRequestSchema,
  sendMessageResponseSchema,
  type SendMessageRequest,
  type SendMessageResponse,
  uploadMediaRequestSchema,
  uploadMediaResponseSchema,
  type UploadMediaRequest,
  type UploadMediaResponse,
  getMediaUrlRequestSchema,
  getMediaUrlResponseSchema,
  type GetMediaUrlRequest,
  type GetMediaUrlResponse,
} from "./schemas";
import type { WhatsAppHttpDownloadResponse } from "./adapter";

export type WhatsAppTemplateRequest<T> = {
  wabaId: string;
  accessToken: string;
  payload: T;
};

export type WhatsAppMessageRequest = {
  phoneNumberId: string;
  accessToken: string;
  payload: SendMessageRequest;
};

export type WhatsAppMediaRequest = {
  phoneNumberId: string;
  accessToken: string;
  file: Blob | File;
  payload: UploadMediaRequest;
};

export class WhatsAppClient {
  private readonly http: WhatsAppHttpAdapter;
  private readonly version: string;

  constructor(http: WhatsAppHttpAdapter, version = "v24.0") {
    this.http = http;
    this.version = version;
  }

  public async createTemplate(
    request: WhatsAppTemplateRequest<CreateWhatsAppTemplateRequest>,
  ) {
    const { ok, body } = await this.http.post({
      path: "/message_templates",
      version: this.version,
      wabaId: request.wabaId,
      accessToken: request.accessToken,
      payload: request.payload,
    });

    if (!ok) {
      throw new Error(`Error creating template: ${body}`);
    }

    return createWhatsAppTemplateResponseSchema.parse(JSON.parse(body));
  }

  public async listTemplates(
    request: WhatsAppTemplateRequest<ListWhatsAppTemplatesRequest>,
  ) {
    const { ok, body } = await this.http.get({
      path: "/message_templates",
      version: this.version,
      wabaId: request.wabaId,
      accessToken: request.accessToken,
      queryParams: request.payload,
    });

    if (!ok) {
      throw new Error(`Error listing templates: ${body}`);
    }

    return listWhatsAppTemplatesResponseSchema.parse(JSON.parse(body));
  }

  public async deleteTemplate(
    request: WhatsAppTemplateRequest<DeleteWhatsAppTemplateRequest>,
  ) {
    const { ok, body } = await this.http.delete({
      path: "/message_templates",
      version: this.version,
      wabaId: request.wabaId,
      accessToken: request.accessToken,
      queryParams: request.payload,
    });

    if (!ok) {
      throw new Error(`Error deleting template: ${body}`);
    }

    return deleteWhatsAppTemplateResponseSchema.parse(JSON.parse(body));
  }

  public async sendMessage(
    request: WhatsAppMessageRequest,
  ): Promise<SendMessageResponse> {
    const validatedPayload = sendMessageRequestSchema.parse(request.payload);

    const { ok, body } = await this.http.post({
      path: "/messages",
      version: this.version,
      wabaId: request.phoneNumberId,
      accessToken: request.accessToken,
      payload: validatedPayload,
    });

    if (!ok) {
      throw new Error(`Error sending message: ${body}`);
    }

    return sendMessageResponseSchema.parse(JSON.parse(body));
  }

  public async uploadMedia(
    request: WhatsAppMediaRequest,
  ): Promise<UploadMediaResponse> {
    const validatedPayload = uploadMediaRequestSchema.parse(request.payload);

    const formData = new FormData();
    formData.append("messaging_product", validatedPayload.messaging_product);
    formData.append("type", validatedPayload.type);
    formData.append("file", request.file);

    const { ok, body } = await this.http.postForm({
      path: "/media",
      version: this.version,
      wabaId: request.phoneNumberId,
      accessToken: request.accessToken,
      formData,
    });

    if (!ok) {
      throw new Error(`Error uploading media: ${body}`);
    }

    return uploadMediaResponseSchema.parse(JSON.parse(body));
  }

  public async getMediaUrl(
    mediaId: string,
    accessToken: string,
    queryParams?: GetMediaUrlRequest,
  ): Promise<GetMediaUrlResponse> {
    const validatedQueryParams = queryParams
      ? getMediaUrlRequestSchema.parse(queryParams)
      : undefined;

    const { ok, body } = await this.http.get({
      path: "",
      version: this.version,
      wabaId: mediaId,
      accessToken,
      queryParams: validatedQueryParams,
    });

    if (!ok) {
      throw new Error(`Error getting media URL: ${body}`);
    }

    return getMediaUrlResponseSchema.parse(JSON.parse(body));
  }

  public async downloadMedia(
    url: string,
    accessToken: string,
  ): Promise<WhatsAppHttpDownloadResponse> {
    const { ok, data, contentType } = await this.http.download({
      url,
      accessToken,
    });

    if (!ok) {
      throw new Error(`Error downloading media from URL: ${url}`);
    }

    return {
      ok,
      data,
      contentType,
    };
  }
}
