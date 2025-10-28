import { describe, expect, test } from "vitest";
import { WhatsAppClient, WhatsAppRequest } from "../src/index";
import { CreateWhatsAppTemplateRequest } from "../src/schemas/template";
import { ReplayWhatsAppHttpAdapter } from "./replay-adapter";
import { loadRequiredEnvVar } from "./environment";

describe("Template Tests", () => {
  test("should create a template with named parameters", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const request = {
      wabaId: "1606335326722023",
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        name: "order_confirmation_v3",
        language: "en_US",
        category: "UTILITY",
        parameter_format: "NAMED",
        components: [
          {
            type: "BODY",
            text: "Thank you, {{first_name}}! Your order number is {{order_number}}. Have a nice day.",
            example: {
              body_text_named_params: [
                {
                  param_name: "first_name",
                  example: "Pablo",
                },
                {
                  param_name: "order_number",
                  example: "860198-230332",
                },
              ],
            },
          },
        ],
      },
    } satisfies WhatsAppRequest<CreateWhatsAppTemplateRequest>;

    const result = await client.createTemplate(request);

    expect(result).toBeDefined();
    expect(typeof result.id).toBe("string");
    expect(result.status).toBe("PENDING");
    expect(result.category).toBe("UTILITY");
  }, 25000);

  test("should create a template with positional parameters", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const request = {
      wabaId: "1606335326722023",
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        name: "seasonal_promotion",
        language: "en",
        category: "MARKETING",
        components: [
          {
            type: "HEADER",
            format: "TEXT",
            text: "Our {{1}} is on!",
            example: {
              header_text: ["Summer Sale"],
            },
          },
          {
            type: "BODY",
            text: "Shop now through {{1}} and use code {{2}} to get {{3}} off of all merchandise.",
            example: {
              body_text: [["the end of August", "25OFF", "25%"]],
            },
          },
          {
            type: "FOOTER",
            text: "Use the buttons below to manage your marketing subscriptions",
          },
          {
            type: "BUTTONS",
            buttons: [
              {
                type: "QUICK_REPLY",
                text: "Unsubcribe from Promos",
              },
              {
                type: "QUICK_REPLY",
                text: "Unsubscribe from All",
              },
            ],
          },
        ],
      },
    } satisfies WhatsAppRequest<CreateWhatsAppTemplateRequest>;

    const result = await client.createTemplate(request);

    expect(result).toBeDefined();
    expect(typeof result.id).toBe("string");
    expect(result.status).toBe("PENDING");
    expect(result.category).toBe("MARKETING");
  }, 25000);
});
