import { describe, expect, test } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { WhatsAppClient } from "../src/index";
import type { WhatsAppMediaRequest } from "../src/index";
import { ReplayWhatsAppHttpAdapter } from "./replay-adapter";
import { loadRequiredEnvVar } from "./environment";

describe("Media Tests", () => {
  test("should upload an image file", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const imagePath = path.join(__dirname, "..", "assets", "circle1.png");
    const imageBuffer = fs.readFileSync(imagePath);
    const file = new Blob([imageBuffer], { type: "image/png" });

    const request = {
      phoneNumberId: loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      file,
      payload: {
        messaging_product: "whatsapp",
        type: "image/png",
      },
    } satisfies WhatsAppMediaRequest;

    const result = await client.uploadMedia(request);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe("string");
    expect(result.id.length).toBeGreaterThan(0);
  }, 25000);

  test("should upload a video file", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const videoData = Buffer.from("fake video content for testing");
    const file = new Blob([videoData], { type: "video/mp4" });

    const request = {
      phoneNumberId: loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      file,
      payload: {
        messaging_product: "whatsapp",
        type: "video/mp4",
      },
    } satisfies WhatsAppMediaRequest;

    const result = await client.uploadMedia(request);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe("string");
  }, 25000);

  test("should upload a document file", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const docData = Buffer.from("This is a test document");
    const file = new Blob([docData], { type: "text/plain" });

    const request = {
      phoneNumberId: loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      file,
      payload: {
        messaging_product: "whatsapp",
        type: "text/plain",
      },
    } satisfies WhatsAppMediaRequest;

    const result = await client.uploadMedia(request);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
  }, 25000);

  test("should get media URL by media ID", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const pngData = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64",
    );
    const file = new Blob([pngData], { type: "image/png" });

    const uploadRequest = {
      phoneNumberId: loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      file,
      payload: {
        messaging_product: "whatsapp",
        type: "image/png",
      },
    } satisfies WhatsAppMediaRequest;

    const uploadResult = await client.uploadMedia(uploadRequest);
    const mediaId = uploadResult.id;

    const result = await client.getMediaUrl(
      mediaId,
      loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
    );

    expect(result).toBeDefined();
    expect(result.messaging_product).toBe("whatsapp");
    expect(result.url).toBeDefined();
    expect(typeof result.url).toBe("string");
    expect(result.mime_type).toBeDefined();
    expect(result.sha256).toBeDefined();
    expect(result.file_size).toBeDefined();
    expect(typeof result.file_size).toBe("number");
    expect(result.id).toBe(mediaId);
  }, 25000);

  test("should get media URL with phone_number_id parameter", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const pngData = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64",
    );
    const file = new Blob([pngData], { type: "image/png" });

    const uploadRequest = {
      phoneNumberId: loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      file,
      payload: {
        messaging_product: "whatsapp",
        type: "image/png",
      },
    } satisfies WhatsAppMediaRequest;

    const uploadResult = await client.uploadMedia(uploadRequest);
    const mediaId = uploadResult.id;

    const result = await client.getMediaUrl(
      mediaId,
      loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      {
        phone_number_id: loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID"),
      },
    );

    expect(result).toBeDefined();
    expect(result.messaging_product).toBe("whatsapp");
    expect(result.url).toBeDefined();
    expect(result.mime_type).toBeDefined();
    expect(result.sha256).toBeDefined();
    expect(result.file_size).toBeDefined();
    expect(result.id).toBe(mediaId);
  }, 25000);

  test("should handle complete upload and retrieve workflow", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);
    const accessToken = loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN");
    const phoneNumberId = loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID");

    const pngData = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64",
    );
    const file = new Blob([pngData], { type: "image/png" });

    const uploadResult = await client.uploadMedia({
      phoneNumberId,
      accessToken,
      file,
      payload: {
        messaging_product: "whatsapp",
        type: "image/png",
      },
    });

    expect(uploadResult.id).toBeDefined();

    const mediaUrlResult = await client.getMediaUrl(
      uploadResult.id,
      accessToken,
    );

    expect(mediaUrlResult.id).toBe(uploadResult.id);
    expect(mediaUrlResult.url).toBeDefined();
    expect(mediaUrlResult.mime_type).toBe("image/png");
  }, 25000);

  test("should download media from URL", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);
    const accessToken = loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN");
    const phoneNumberId = loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID");

    const imagePath = path.join(__dirname, "..", "assets", "circle1.png");
    const imageBuffer = fs.readFileSync(imagePath);
    const file = new Blob([imageBuffer], { type: "image/png" });

    const uploadResult = await client.uploadMedia({
      phoneNumberId,
      accessToken,
      file,
      payload: {
        messaging_product: "whatsapp",
        type: "image/png",
      },
    });

    const mediaUrlResult = await client.getMediaUrl(
      uploadResult.id,
      accessToken,
    );

    expect(mediaUrlResult.url).toBeDefined();

    const downloadResult = await client.downloadMedia(
      mediaUrlResult.url,
      accessToken,
    );

    expect(downloadResult).toBeDefined();
    expect(downloadResult.ok).toBe(true);
    expect(downloadResult.data).toBeDefined();
    expect(downloadResult.data).toBeInstanceOf(ReadableStream);
    expect(downloadResult.contentType).toBeDefined();
    expect(downloadResult.contentType).toContain("image");
  }, 25000);

  test("should handle complete media lifecycle", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);
    const accessToken = loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN");
    const phoneNumberId = loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID");

    const imagePath = path.join(__dirname, "..", "assets", "circle1.png");
    const imageBuffer = fs.readFileSync(imagePath);
    const file = new Blob([imageBuffer], { type: "image/png" });

    const uploadResult = await client.uploadMedia({
      phoneNumberId,
      accessToken,
      file,
      payload: {
        messaging_product: "whatsapp",
        type: "image/png",
      },
    });

    expect(uploadResult.id).toBeDefined();

    const mediaUrlResult = await client.getMediaUrl(
      uploadResult.id,
      accessToken,
    );

    expect(mediaUrlResult.id).toBe(uploadResult.id);
    expect(mediaUrlResult.url).toBeDefined();

    const downloadResult = await client.downloadMedia(
      mediaUrlResult.url,
      accessToken,
    );

    expect(downloadResult.ok).toBe(true);
    expect(downloadResult.data).toBeDefined();
    expect(downloadResult.data).toBeInstanceOf(ReadableStream);
  }, 25000);
});
