import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import {
  FetchWhatsAppHttpAdapter,
  WhatsAppHttpRequest,
  WhatsAppHttpPayloadRequest,
  WhatsAppHttpResponse,
} from "../src/adapter";

export class ReplayWhatsAppHttpAdapter extends FetchWhatsAppHttpAdapter {
  private cacheDir: string;

  constructor() {
    super();
    this.cacheDir = path.join(__dirname, "..", ".replay-cache");
    this.ensureCacheDirExists();
  }

  async get(request: WhatsAppHttpRequest): Promise<WhatsAppHttpResponse> {
    const cacheKey = this.generateCacheKey("GET", request);
    const cachedResponse = this.readFromCache(cacheKey);

    if (cachedResponse) {
      return cachedResponse;
    }

    const response = await super.get(request);
    this.writeToCache(cacheKey, response);
    return response;
  }

  async post(
    request: WhatsAppHttpPayloadRequest,
  ): Promise<WhatsAppHttpResponse> {
    const cacheKey = this.generateCacheKey("POST", request);
    const cachedResponse = this.readFromCache(cacheKey);

    if (cachedResponse) {
      return cachedResponse;
    }

    const response = await super.post(request);
    this.writeToCache(cacheKey, response);
    return response;
  }

  private generateCacheKey(
    method: string,
    request: WhatsAppHttpRequest | WhatsAppHttpPayloadRequest,
  ): string {
    const requestData = {
      method,
      path: request.path,
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

  private getCacheFilePath(cacheKey: string): string {
    return path.join(this.cacheDir, `${cacheKey}.json`);
  }

  private ensureCacheDirExists(): void {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  private readFromCache(cacheKey: string): WhatsAppHttpResponse | null {
    const filePath = this.getCacheFilePath(cacheKey);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const cached = JSON.parse(content);
      return {
        ok: cached.ok,
        body: cached.body,
      };
    } catch (error) {
      console.warn(`Failed to read cache file ${filePath}:`, error);
      return null;
    }
  }

  private writeToCache(cacheKey: string, response: WhatsAppHttpResponse): void {
    const filePath = this.getCacheFilePath(cacheKey);

    try {
      const cacheData = {
        ok: response.ok,
        body: response.body,
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
    const filePath = this.getCacheFilePath(cacheKey);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
