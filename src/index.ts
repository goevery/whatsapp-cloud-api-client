import type { WhatsAppHttpAdapter } from "./adapter";
import {
  createWhatsAppTemplateResponseSchema,
  listWhatsAppTemplatesResponseSchema,
  deleteWhatsAppTemplateResponseSchema,
  type CreateWhatsAppTemplateRequest,
  type ListWhatsAppTemplatesRequest,
  type DeleteWhatsAppTemplateRequest,
} from "./schemas/template";
import {
  sendMessageRequestSchema,
  sendMessageResponseSchema,
  type SendMessageRequest,
  type SendMessageResponse,
} from "./schemas/message";

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
}
