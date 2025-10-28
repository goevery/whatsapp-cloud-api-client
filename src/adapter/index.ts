export type WhatsAppHttpRequest = {
  path: string;
  queryParams?: Record<string, string>;
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
  delete(request: WhatsAppHttpRequest): Promise<WhatsAppHttpResponse>;
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

  async delete(request: WhatsAppHttpRequest): Promise<WhatsAppHttpResponse> {
    const url = this.buildUrl(request);
    const headers = this.buildHeaders(request.accessToken);

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    });

    const body = await response.text();

    return {
      ok: response.ok,
      body,
    };
  }

  private buildUrl(request: WhatsAppHttpRequest): string {
    const baseUrl = `https://graph.facebook.com/${request.version}/${request.wabaId}${request.path}`;

    if (request.queryParams && Object.keys(request.queryParams).length > 0) {
      const queryString = new URLSearchParams(request.queryParams).toString();

      return `${baseUrl}?${queryString}`;
    }

    return baseUrl;
  }

  private buildHeaders(accessToken: string) {
    return {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
  }
}
