export type WhatsAppHttpRequest = {
  path: string;
  version: string;
  wabaId: string;
  accessToken: string;
};

export type WhatsAppHttpPayloadRequest = WhatsAppHttpRequest & {
  payload: object;
};

export type WhatsAppHttpResponse = {
  ok: boolean;
  body: string;
};

export interface WhatsAppHttpAdapter {
  get(request: WhatsAppHttpRequest): Promise<WhatsAppHttpResponse>;
  post(request: WhatsAppHttpPayloadRequest): Promise<WhatsAppHttpResponse>;
}

export class FetchWhatsAppHttpAdapter implements WhatsAppHttpAdapter {
  async get(request: WhatsAppHttpRequest): Promise<WhatsAppHttpResponse> {
    const url = this.buildUrl(request);
    const headers = this.buildHeaders(request.accessToken);

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const body = await response.text();

    return {
      ok: response.ok,
      body,
    };
  }

  async post(
    request: WhatsAppHttpPayloadRequest,
  ): Promise<WhatsAppHttpResponse> {
    const url = this.buildUrl(request);
    const headers = this.buildHeaders(request.accessToken);

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(request.payload),
    });

    const body = await response.text();

    return {
      ok: response.ok,
      body,
    };
  }

  private buildUrl(request: WhatsAppHttpRequest): string {
    return `https://graph.facebook.com/${request.version}/${request.wabaId}${request.path}`;
  }

  private buildHeaders(accessToken: string) {
    return {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
  }
}
