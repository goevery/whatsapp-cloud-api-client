import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import z from "zod";
import { FetchWhatsAppHttpAdapter } from "../src/adapter";
import type {
  WhatsAppHttpRequest,
  WhatsAppHttpPayloadRequest,
  WhatsAppHttpResponse,
} from "../src/adapter";

const cachedDataSchema = z.object({
  request: z.object({
    method: z.string(),
    path: z.string(),
    queryParams: z.record(z.string(), z.string()).optional(),
    version: z.string(),
    wabaId: z.string(),
    payload: z.looseObject({}).optional(),
  }),
  response: z.object({
    ok: z.boolean(),
    body: z.string(),
  }),
  cachedAt: z.string(),
});

export class ReplayWhatsAppHttpAdapter extends FetchWhatsAppHttpAdapter {
  private cacheDir: string;

  constructor() {
    super();
    this.cacheDir = path.join(__dirname, "..", ".replay-cache");
    this.ensureCacheDirExists();
  }

  async get(request: WhatsAppHttpRequest): Promise<WhatsAppHttpResponse> {
    const cacheKey = this.generateCacheKey("GET", request);
    const cachedResponse = this.readFromCache(cacheKey, "GET", request.path);

    if (cachedResponse) {
      return cachedResponse;
    }

    const response = await super.get(request);

    this.writeToCache(cacheKey, response, request, "GET", request.path);

    return response;
  }

  async post(
    request: WhatsAppHttpPayloadRequest,
  ): Promise<WhatsAppHttpResponse> {
    const cacheKey = this.generateCacheKey("POST", request);
    const cachedResponse = this.readFromCache(cacheKey, "POST", request.path);

    if (cachedResponse) {
      return cachedResponse;
    }

    const response = await super.post(request);

    this.writeToCache(cacheKey, response, request, "POST", request.path);

    return response;
  }

  async delete(request: WhatsAppHttpRequest): Promise<WhatsAppHttpResponse> {
    const cacheKey = this.generateCacheKey("DELETE", request);
    const cachedResponse = this.readFromCache(cacheKey, "DELETE", request.path);

    if (cachedResponse) {
      return cachedResponse;
    }

    const response = await super.delete(request);

    this.writeToCache(cacheKey, response, request, "DELETE", request.path);

    return response;
  }

  private generateCacheKey(
    method: string,
    request: WhatsAppHttpRequest | WhatsAppHttpPayloadRequest,
  ): string {
    const requestData = {
      method,
      path: request.path,
      queryParams: request.queryParams,
      version: request.version,
      wabaId: request.wabaId,
      payload: "payload" in request ? request.payload : undefined,
    };

    const hash = crypto
      .createHash("sha256")
      .update(JSON.stringify(requestData))
      .digest("hex");

    return hash;
  }

  private getCacheFilePath(
    cacheKey: string,
    method: string,
    requestPath: string,
  ): string {
    const sanitizedPath = requestPath.replace(/[^a-zA-Z0-9]/g, "_");

    return path.join(
      this.cacheDir,
      `${method}_${sanitizedPath}_${cacheKey}.json`,
    );
  }

  private ensureCacheDirExists(): void {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  private readFromCache(
    cacheKey: string,
    method: string,
    requestPath: string,
  ): WhatsAppHttpResponse | null {
    const filePath = this.getCacheFilePath(cacheKey, method, requestPath);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const parsed = cachedDataSchema.parse(JSON.parse(content));

      return {
        ok: parsed.response.ok,
        body: parsed.response.body,
      };
    } catch (error) {
      console.warn(`Failed to read cache file ${filePath}:`, error);
      return null;
    }
  }

  private writeToCache(
    cacheKey: string,
    response: WhatsAppHttpResponse,
    request: WhatsAppHttpRequest | WhatsAppHttpPayloadRequest,
    method: string,
    requestPath: string,
  ): void {
    const filePath = this.getCacheFilePath(cacheKey, method, requestPath);

    try {
      const cacheData = {
        request: {
          method,
          path: request.path,
          queryParams: request.queryParams,
          version: request.version,
          wabaId: request.wabaId,
          payload: "payload" in request ? request.payload : undefined,
        },
        response: {
          ok: response.ok,
          body: response.body,
        },
        cachedAt: new Date().toISOString(),
      };

      fs.writeFileSync(filePath, JSON.stringify(cacheData, null, 2), "utf-8");
    } catch (error) {
      console.warn(`Failed to write cache file ${filePath}:`, error);
    }
  }

  clearCache(): void {
    if (fs.existsSync(this.cacheDir)) {
      const files = fs.readdirSync(this.cacheDir);
      for (const file of files) {
        if (file.endsWith(".json")) {
          fs.unlinkSync(path.join(this.cacheDir, file));
        }
      }
    }
  }

  clearCacheForRequest(
    method: string,
    request: WhatsAppHttpRequest | WhatsAppHttpPayloadRequest,
  ): void {
    const cacheKey = this.generateCacheKey(method, request);
    const filePath = this.getCacheFilePath(cacheKey, method, request.path);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
