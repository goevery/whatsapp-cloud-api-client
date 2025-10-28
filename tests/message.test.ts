import { describe, expect, test } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { WhatsAppClient } from "../src/index";
import type {
  WhatsAppMessageRequest,
  WhatsAppMediaRequest,
} from "../src/index";
import { ReplayWhatsAppHttpAdapter } from "./replay-adapter";
import { loadRequiredEnvVar } from "./environment";

describe("Message Tests", () => {
  test("should send a simple text message", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const request = {
      phoneNumberId: loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        messaging_product: "whatsapp",
        to: loadRequiredEnvVar("WHATSAPP_TEST_RECIPIENT"),
        type: "text",
        text: {
          body: "Hello! This is a test message.",
        },
      },
    } satisfies WhatsAppMessageRequest;

    const result = await client.sendMessage(request);

    expect(result).toBeDefined();
    expect(result.messaging_product).toBe("whatsapp");
    expect(result.contacts).toBeDefined();
    expect(Array.isArray(result.contacts)).toBe(true);
    expect(result.contacts.length).toBeGreaterThan(0);
    expect(result.messages).toBeDefined();
    expect(Array.isArray(result.messages)).toBe(true);
    expect(result.messages.length).toBeGreaterThan(0);
    expect(result.messages[0].id).toBeDefined();
  }, 25000);

  test("should send a text message with URL preview", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const request = {
      phoneNumberId: loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        messaging_product: "whatsapp",
        to: loadRequiredEnvVar("WHATSAPP_TEST_RECIPIENT"),
        type: "text",
        text: {
          preview_url: true,
          body: "Check out this link: https://www.example.com",
        },
      },
    } satisfies WhatsAppMessageRequest;

    const result = await client.sendMessage(request);

    expect(result).toBeDefined();
    expect(result.messaging_product).toBe("whatsapp");
    expect(result.messages[0].id).toBeDefined();
  }, 25000);

  test("should send an image message with media ID", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);
    const phoneNumberId = loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID");
    const accessToken = loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN");

    const imagePath = path.join(__dirname, "..", "assets", "circle1.png");
    const imageBuffer = fs.readFileSync(imagePath);
    const file = new Blob([imageBuffer], { type: "image/png" });

    const uploadRequest = {
      phoneNumberId,
      accessToken,
      file,
      payload: {
        messaging_product: "whatsapp",
        type: "image/png",
      },
    } satisfies WhatsAppMediaRequest;

    const uploadResult = await client.uploadMedia(uploadRequest);
    const mediaId = uploadResult.id;

    const request = {
      phoneNumberId,
      accessToken,
      payload: {
        messaging_product: "whatsapp",
        to: loadRequiredEnvVar("WHATSAPP_TEST_RECIPIENT"),
        type: "image",
        image: {
          id: mediaId,
          caption: "This is a test image",
        },
      },
    } satisfies WhatsAppMessageRequest;

    const result = await client.sendMessage(request);

    expect(result).toBeDefined();
    expect(result.messaging_product).toBe("whatsapp");
    expect(result.messages[0].id).toBeDefined();
  }, 25000);

  test("should send an image message with link", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const request = {
      phoneNumberId: loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        messaging_product: "whatsapp",
        to: loadRequiredEnvVar("WHATSAPP_TEST_RECIPIENT"),
        type: "image",
        image: {
          link: "https://example.com/image.jpg",
          caption: "Image from URL",
        },
      },
    } satisfies WhatsAppMessageRequest;

    const result = await client.sendMessage(request);

    expect(result).toBeDefined();
    expect(result.messaging_product).toBe("whatsapp");
    expect(result.messages[0].id).toBeDefined();
  }, 25000);

  test("should send a video message", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const request = {
      phoneNumberId: loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        messaging_product: "whatsapp",
        to: loadRequiredEnvVar("WHATSAPP_TEST_RECIPIENT"),
        type: "video",
        video: {
          link: "https://example.com/video.mp4",
          caption: "Test video",
        },
      },
    } satisfies WhatsAppMessageRequest;

    const result = await client.sendMessage(request);

    expect(result).toBeDefined();
    expect(result.messaging_product).toBe("whatsapp");
    expect(result.messages[0].id).toBeDefined();
  }, 25000);

  test("should send an audio message", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const request = {
      phoneNumberId: loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        messaging_product: "whatsapp",
        to: loadRequiredEnvVar("WHATSAPP_TEST_RECIPIENT"),
        type: "audio",
        audio: {
          link: "https://example.com/audio.mp3",
        },
      },
    } satisfies WhatsAppMessageRequest;

    const result = await client.sendMessage(request);

    expect(result).toBeDefined();
    expect(result.messaging_product).toBe("whatsapp");
    expect(result.messages[0].id).toBeDefined();
  }, 25000);

  test("should send a document message", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const request = {
      phoneNumberId: loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        messaging_product: "whatsapp",
        to: loadRequiredEnvVar("WHATSAPP_TEST_RECIPIENT"),
        type: "document",
        document: {
          link: "https://example.com/document.pdf",
          filename: "test-document.pdf",
          caption: "Important document",
        },
      },
    } satisfies WhatsAppMessageRequest;

    const result = await client.sendMessage(request);

    expect(result).toBeDefined();
    expect(result.messaging_product).toBe("whatsapp");
    expect(result.messages[0].id).toBeDefined();
  }, 25000);

  test("should send a sticker message", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const request = {
      phoneNumberId: loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        messaging_product: "whatsapp",
        to: loadRequiredEnvVar("WHATSAPP_TEST_RECIPIENT"),
        type: "sticker",
        sticker: {
          link: "https://example.com/sticker.webp",
        },
      },
    } satisfies WhatsAppMessageRequest;

    const result = await client.sendMessage(request);

    expect(result).toBeDefined();
    expect(result.messaging_product).toBe("whatsapp");
    expect(result.messages[0].id).toBeDefined();
  }, 25000);

  test("should send a location message", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const request = {
      phoneNumberId: loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        messaging_product: "whatsapp",
        to: loadRequiredEnvVar("WHATSAPP_TEST_RECIPIENT"),
        type: "location",
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
          name: "San Francisco",
          address: "San Francisco, CA, USA",
        },
      },
    } satisfies WhatsAppMessageRequest;

    const result = await client.sendMessage(request);

    expect(result).toBeDefined();
    expect(result.messaging_product).toBe("whatsapp");
    expect(result.messages[0].id).toBeDefined();
  }, 25000);

  test("should send a contact message", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const request = {
      phoneNumberId: loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        messaging_product: "whatsapp",
        to: loadRequiredEnvVar("WHATSAPP_TEST_RECIPIENT"),
        type: "contacts",
        contacts: [
          {
            name: {
              formatted_name: "John Doe",
              first_name: "John",
              last_name: "Doe",
            },
            phones: [
              {
                phone: "+1234567890",
                type: "WORK",
              },
            ],
            emails: [
              {
                email: "john.doe@example.com",
                type: "WORK",
              },
            ],
          },
        ],
      },
    } satisfies WhatsAppMessageRequest;

    const result = await client.sendMessage(request);

    expect(result).toBeDefined();
    expect(result.messaging_product).toBe("whatsapp");
    expect(result.messages[0].id).toBeDefined();
  }, 25000);

  test("should send a reaction message", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    // First, send a text message
    const textRequest = {
      phoneNumberId: loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        messaging_product: "whatsapp",
        to: loadRequiredEnvVar("WHATSAPP_TEST_RECIPIENT"),
        type: "text",
        text: {
          body: "This is a test message to react to.",
        },
      },
    } satisfies WhatsAppMessageRequest;

    const textResult = await client.sendMessage(textRequest);

    expect(textResult).toBeDefined();
    expect(textResult.messages).toBeDefined();
    expect(textResult.messages[0].id).toBeDefined();

    const messageIdToReactTo = textResult.messages[0].id;

    // Now send a reaction to the text message
    const reactionRequest = {
      phoneNumberId: loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        messaging_product: "whatsapp",
        to: loadRequiredEnvVar("WHATSAPP_TEST_RECIPIENT"),
        type: "reaction",
        reaction: {
          message_id: messageIdToReactTo,
          emoji: "👍",
        },
      },
    } satisfies WhatsAppMessageRequest;

    const reactionResult = await client.sendMessage(reactionRequest);

    expect(reactionResult).toBeDefined();
    expect(reactionResult.messaging_product).toBe("whatsapp");
    expect(reactionResult.messages[0].id).toBeDefined();
  }, 25000);

  test("should send an interactive reply button message", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const request = {
      phoneNumberId: loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        messaging_product: "whatsapp",
        to: loadRequiredEnvVar("WHATSAPP_TEST_RECIPIENT"),
        type: "interactive",
        interactive: {
          type: "button",
          body: {
            text: "Please select an option:",
          },
          action: {
            buttons: [
              {
                type: "reply",
                reply: {
                  id: "option_1",
                  title: "Option 1",
                },
              },
              {
                type: "reply",
                reply: {
                  id: "option_2",
                  title: "Option 2",
                },
              },
            ],
          },
        },
      },
    } satisfies WhatsAppMessageRequest;

    const result = await client.sendMessage(request);

    expect(result).toBeDefined();
    expect(result.messaging_product).toBe("whatsapp");
    expect(result.messages[0].id).toBeDefined();
  }, 25000);

  test("should send an interactive list message", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const request = {
      phoneNumberId: loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        messaging_product: "whatsapp",
        to: loadRequiredEnvVar("WHATSAPP_TEST_RECIPIENT"),
        type: "interactive",
        interactive: {
          type: "list",
          header: {
            type: "text",
            text: "Menu Options",
          },
          body: {
            text: "Please select an option from the list below:",
          },
          footer: {
            text: "Powered by WhatsApp",
          },
          action: {
            button: "View Options",
            sections: [
              {
                title: "Section 1",
                rows: [
                  {
                    id: "row_1",
                    title: "Option 1",
                    description: "Description for option 1",
                  },
                  {
                    id: "row_2",
                    title: "Option 2",
                    description: "Description for option 2",
                  },
                ],
              },
            ],
          },
        },
      },
    } satisfies WhatsAppMessageRequest;

    const result = await client.sendMessage(request);

    expect(result).toBeDefined();
    expect(result.messaging_product).toBe("whatsapp");
    expect(result.messages[0].id).toBeDefined();
  }, 25000);

  test("should send a template message with named parameters (restaurar_conversation)", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    // Use approved template: restaurar_conversation
    const request = {
      phoneNumberId: loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        messaging_product: "whatsapp",
        to: loadRequiredEnvVar("WHATSAPP_TEST_RECIPIENT"),
        type: "template",
        template: {
          name: "restaurar_conversation",
          language: {
            code: "es",
            policy: "deterministic",
          },
          components: [
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: "Juan",
                  parameter_name: "cliente",
                },
              ],
            },
          ],
        },
      },
    } satisfies WhatsAppMessageRequest;

    const result = await client.sendMessage(request);

    expect(result).toBeDefined();
    expect(result.messaging_product).toBe("whatsapp");
    expect(result.messages[0].id).toBeDefined();
  }, 25000);

  test("should send a template message with header and body parameters (informe_de_pedido_guia)", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    // Use approved template: informe_de_pedido_guia
    const request = {
      phoneNumberId: loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        messaging_product: "whatsapp",
        to: loadRequiredEnvVar("WHATSAPP_TEST_RECIPIENT"),
        type: "template",
        template: {
          name: "informe_de_pedido_guia",
          language: {
            code: "es",
            policy: "deterministic",
          },
          components: [
            {
              type: "header",
              parameters: [
                {
                  type: "text",
                  text: "María",
                  parameter_name: "cliente",
                },
              ],
            },
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: "María",
                  parameter_name: "cliente",
                },
                {
                  type: "text",
                  text: "TiendaOnline",
                  parameter_name: "tienda",
                },
                {
                  type: "text",
                  text: "123456789",
                  parameter_name: "guia",
                },
              ],
            },
          ],
        },
      },
    } satisfies WhatsAppMessageRequest;

    const result = await client.sendMessage(request);

    expect(result).toBeDefined();
    expect(result.messaging_product).toBe("whatsapp");
    expect(result.messages[0].id).toBeDefined();
  }, 25000);

  test("should send a template message with buttons (every_assistant_confirmation_correct_details)", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    // Use approved template: every_assistant_confirmation_correct_details
    const request = {
      phoneNumberId: loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        messaging_product: "whatsapp",
        to: loadRequiredEnvVar("WHATSAPP_TEST_RECIPIENT"),
        type: "template",
        template: {
          name: "every_assistant_confirmation_correct_details",
          language: {
            code: "es",
            policy: "deterministic",
          },
          components: [
            {
              type: "header",
              parameters: [
                {
                  type: "text",
                  text: "Mi Tienda",
                  parameter_name: "store_name",
                },
              ],
            },
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: "Carlos",
                  parameter_name: "buyer_name",
                },
                {
                  type: "text",
                  text: "Ana García",
                  parameter_name: "seller_name",
                },
                {
                  type: "text",
                  text: "Mi Tienda",
                  parameter_name: "store_name",
                },
                {
                  type: "text",
                  text: "2x Producto A, 1x Producto B",
                  parameter_name: "product_list",
                },
                {
                  type: "text",
                  text: "Calle 123, Ciudad",
                  parameter_name: "shipping_address",
                },
                {
                  type: "text",
                  text: "$150.00",
                  parameter_name: "total_price",
                },
                {
                  type: "text",
                  text: "Transferencia bancaria",
                  parameter_name: "payment_method",
                },
              ],
            },
            {
              type: "button",
              sub_type: "quick_reply",
              index: 0,
              parameters: [
                {
                  type: "payload",
                  payload: "confirm_order",
                },
              ],
            },
            {
              type: "button",
              sub_type: "quick_reply",
              index: 1,
              parameters: [
                {
                  type: "payload",
                  payload: "needs_correction",
                },
              ],
            },
          ],
        },
      },
    } satisfies WhatsAppMessageRequest;

    const result = await client.sendMessage(request);

    expect(result).toBeDefined();
    expect(result.messaging_product).toBe("whatsapp");
    expect(result.messages[0].id).toBeDefined();
  }, 25000);

  test("should send a message with context (reply)", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    // First, send a text message
    const textRequest = {
      phoneNumberId: loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        messaging_product: "whatsapp",
        to: loadRequiredEnvVar("WHATSAPP_TEST_RECIPIENT"),
        type: "text",
        text: {
          body: "This is the original message.",
        },
      },
    } satisfies WhatsAppMessageRequest;

    const textResult = await client.sendMessage(textRequest);

    expect(textResult).toBeDefined();
    expect(textResult.messages).toBeDefined();
    expect(textResult.messages[0].id).toBeDefined();

    const messageIdToReplyTo = textResult.messages[0].id;

    // Now send a reply to the text message
    const replyRequest = {
      phoneNumberId: loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        messaging_product: "whatsapp",
        to: loadRequiredEnvVar("WHATSAPP_TEST_RECIPIENT"),
        context: {
          message_id: messageIdToReplyTo,
        },
        type: "text",
        text: {
          body: "This is a reply to your message",
        },
      },
    } satisfies WhatsAppMessageRequest;

    const replyResult = await client.sendMessage(replyRequest);

    expect(replyResult).toBeDefined();
    expect(replyResult.messaging_product).toBe("whatsapp");
    expect(replyResult.messages[0].id).toBeDefined();
  }, 25000);

  test("should send a message with callback data", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const request = {
      phoneNumberId: loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        messaging_product: "whatsapp",
        to: loadRequiredEnvVar("WHATSAPP_TEST_RECIPIENT"),
        biz_opaque_callback_data: "custom-tracking-data-12345",
        type: "text",
        text: {
          body: "Message with tracking data",
        },
      },
    } satisfies WhatsAppMessageRequest;

    const result = await client.sendMessage(request);

    expect(result).toBeDefined();
    expect(result.messaging_product).toBe("whatsapp");
    expect(result.messages[0].id).toBeDefined();
  }, 25000);

  test("should send an interactive product message", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const request = {
      phoneNumberId: loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        messaging_product: "whatsapp",
        to: loadRequiredEnvVar("WHATSAPP_TEST_RECIPIENT"),
        type: "interactive",
        interactive: {
          type: "product",
          body: {
            text: "Check out this product!",
          },
          footer: {
            text: "Available now",
          },
          action: {
            catalog_id: loadRequiredEnvVar("WHATSAPP_TEST_CATALOG_ID"),
            product_retailer_id: loadRequiredEnvVar("WHATSAPP_TEST_PRODUCT_ID"),
          },
        },
      },
    } satisfies WhatsAppMessageRequest;

    const result = await client.sendMessage(request);

    expect(result).toBeDefined();
    expect(result.messaging_product).toBe("whatsapp");
    expect(result.messages[0].id).toBeDefined();
  }, 25000);

  test("should send an interactive product list message", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const request = {
      phoneNumberId: loadRequiredEnvVar("WHATSAPP_PHONE_NUMBER_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        messaging_product: "whatsapp",
        to: loadRequiredEnvVar("WHATSAPP_TEST_RECIPIENT"),
        type: "interactive",
        interactive: {
          type: "product_list",
          header: {
            type: "text",
            text: "Our Products",
          },
          body: {
            text: "Browse our product catalog",
          },
          footer: {
            text: "Shop now",
          },
          action: {
            catalog_id: loadRequiredEnvVar("WHATSAPP_TEST_CATALOG_ID"),
            sections: [
              {
                title: "Featured Items",
                product_items: [
                  {
                    product_retailer_id: loadRequiredEnvVar(
                      "WHATSAPP_TEST_PRODUCT_ID",
                    ),
                  },
                ],
              },
            ],
          },
        },
      },
    } satisfies WhatsAppMessageRequest;

    const result = await client.sendMessage(request);

    expect(result).toBeDefined();
    expect(result.messaging_product).toBe("whatsapp");
    expect(result.messages[0].id).toBeDefined();
  }, 25000);
});
