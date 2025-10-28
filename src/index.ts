import type { WhatsAppHttpAdapter } from "./adapter";
import {
  createWhatsAppTemplateResponseSchema,
  listWhatsAppTemplatesResponseSchema,
  type CreateWhatsAppTemplateRequest,
  type ListWhatsAppTemplatesRequest,
} from "./schemas/template";

export type WhatsAppRequest<T> = {
  wabaId: string;
  accessToken: string;
  payload: T;
};

export class WhatsAppClient {
  private readonly http: WhatsAppHttpAdapter;
  private readonly version: string;

  constructor(http: WhatsAppHttpAdapter, version = "v24.0") {
    this.http = http;
    this.version = version;
  }

  public async createTemplate(
    request: WhatsAppRequest<CreateWhatsAppTemplateRequest>,
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
    request: WhatsAppRequest<ListWhatsAppTemplatesRequest>,
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
}
