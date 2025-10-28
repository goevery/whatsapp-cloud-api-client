export type WhatsAppHttpRequest = {
  path: string;
  queryParams?: Record<string, string>;
  version: string;
  accessToken: string;
};

export type WhatsAppHttpPayloadRequest = WhatsAppHttpRequest & {
  payload: object;
};

export type WhatsAppHttpFormRequest = WhatsAppHttpRequest & {
  formData: FormData;
};

export type WhatsAppHttpResponse = {
  ok: boolean;
  body: string;
};

export type WhatsAppHttpDownloadRequest = {
  url: string;
  accessToken: string;
};

export type WhatsAppHttpDownloadResponse = {
  ok: boolean;
  data: ReadableStream<Uint8Array> | null;
  contentType: string;
};

export type WhatsAppHttpAdapter = {
  get(request: WhatsAppHttpRequest): Promise<WhatsAppHttpResponse>;
  post(request: WhatsAppHttpPayloadRequest): Promise<WhatsAppHttpResponse>;
  postForm(request: WhatsAppHttpFormRequest): Promise<WhatsAppHttpResponse>;
  delete(request: WhatsAppHttpRequest): Promise<WhatsAppHttpResponse>;
  download(
    request: WhatsAppHttpDownloadRequest,
  ): Promise<WhatsAppHttpDownloadResponse>;
};

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

  async postForm(
    request: WhatsAppHttpFormRequest,
  ): Promise<WhatsAppHttpResponse> {
    const url = this.buildUrl(request);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${request.accessToken}`,
      },
      body: request.formData,
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
    const baseUrl = `https://graph.facebook.com/${request.version}${request.path}`;

    if (request.queryParams && Object.keys(request.queryParams).length > 0) {
      const queryString = new URLSearchParams(request.queryParams).toString();

      return `${baseUrl}?${queryString}`;
    }

    return baseUrl;
  }

  async download(
    request: WhatsAppHttpDownloadRequest,
  ): Promise<WhatsAppHttpDownloadResponse> {
    const response = await fetch(request.url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${request.accessToken}`,
      },
    });

    const contentType = response.headers.get("content-type") ?? "";

    return {
      ok: response.ok,
      data: response.body,
      contentType,
    };
  }

  private buildHeaders(accessToken: string) {
    return {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };
  }
}
