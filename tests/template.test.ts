import { describe, expect, test } from "vitest";
import { WhatsAppClient } from "../src/index";
import type { WhatsAppTemplateRequest } from "../src/index";
import type {
  CreateWhatsAppTemplateRequest,
  ListWhatsAppTemplatesRequest,
  DeleteWhatsAppTemplateRequest,
} from "../src/schemas";
import { ReplayWhatsAppHttpAdapter } from "./replay-adapter";
import { loadRequiredEnvVar } from "./environment";

const TEMPLATES_VERSION = "_v15";

describe("Template Tests", () => {
  test("should create a simple template without parameters", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const request = {
      wabaId: loadRequiredEnvVar("WHATSAPP_WABA_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        name: `welcome_message${TEMPLATES_VERSION}`,
        language: "en",
        category: "MARKETING",
        components: [
          {
            type: "BODY",
            text: "Welcome to our service! We're glad to have you here.",
          },
        ],
      },
    } satisfies WhatsAppTemplateRequest<CreateWhatsAppTemplateRequest>;

    const result = await client.createTemplate(request);

    expect(result).toBeDefined();
    expect(typeof result.id).toBe("string");
    expect(result.status).toBe("PENDING");
    expect(result.category).toBe("MARKETING");
  }, 25000);

  test("should create a template with all components but no parameters", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const request = {
      wabaId: loadRequiredEnvVar("WHATSAPP_WABA_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        name: `complete_template_no_params${TEMPLATES_VERSION}`,
        language: "en",
        category: "MARKETING",
        components: [
          {
            type: "HEADER",
            format: "TEXT",
            text: "Special Announcement",
          },
          {
            type: "BODY",
            text: "Thank you for being a valued customer. We appreciate your business and look forward to serving you.",
          },
          {
            type: "FOOTER",
            text: "This is an automated message",
          },
          {
            type: "BUTTONS",
            buttons: [
              {
                type: "QUICK_REPLY",
                text: "Thank You",
              },
              {
                type: "QUICK_REPLY",
                text: "More Info",
              },
            ],
          },
        ],
      },
    } satisfies WhatsAppTemplateRequest<CreateWhatsAppTemplateRequest>;

    const result = await client.createTemplate(request);

    expect(result).toBeDefined();
    expect(typeof result.id).toBe("string");
    expect(result.status).toBe("PENDING");
    expect(result.category).toBe("MARKETING");
  }, 25000);

  test("should create a template with positional parameters", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const request = {
      wabaId: loadRequiredEnvVar("WHATSAPP_WABA_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        name: `seasonal_promotion${TEMPLATES_VERSION}`,
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
    } satisfies WhatsAppTemplateRequest<CreateWhatsAppTemplateRequest>;

    const result = await client.createTemplate(request);

    expect(result).toBeDefined();
    expect(typeof result.id).toBe("string");
    expect(result.status).toBe("PENDING");
    expect(result.category).toBe("MARKETING");
  }, 25000);

  test("should create a template with named parameters", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const request = {
      wabaId: loadRequiredEnvVar("WHATSAPP_WABA_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        name: `order_confirmation${TEMPLATES_VERSION}`,
        language: "en_US",
        category: "MARKETING",
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
    } satisfies WhatsAppTemplateRequest<CreateWhatsAppTemplateRequest>;

    const result = await client.createTemplate(request);

    expect(result).toBeDefined();
    expect(typeof result.id).toBe("string");
    expect(result.status).toBe("PENDING");
    expect(result.category).toBe("MARKETING");
  }, 25000);

  test("should create a template with header and footer", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const request = {
      wabaId: loadRequiredEnvVar("WHATSAPP_WABA_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        name: `order_delivery_update${TEMPLATES_VERSION}`,
        language: "en_US",
        category: "MARKETING",
        components: [
          {
            type: "HEADER",
            format: "LOCATION",
          },
          {
            type: "BODY",
            text: "Good news {{1}}! Your order #{{2}} is on its way to the location above. Thank you for your order!",
            example: {
              body_text: [["Mark", "566701"]],
            },
          },
          {
            type: "FOOTER",
            text: "To stop receiving delivery updates, tap the button below.",
          },
          {
            type: "BUTTONS",
            buttons: [
              {
                type: "QUICK_REPLY",
                text: "Stop Delivery Updates",
              },
            ],
          },
        ],
      },
    } satisfies WhatsAppTemplateRequest<CreateWhatsAppTemplateRequest>;

    const result = await client.createTemplate(request);

    expect(result).toBeDefined();
    expect(typeof result.id).toBe("string");
    expect(result.status).toBe("PENDING");
    expect(result.category).toBe("MARKETING");
  }, 25000);

  test("should list templates", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const request = {
      wabaId: loadRequiredEnvVar("WHATSAPP_WABA_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {},
    } satisfies WhatsAppTemplateRequest<ListWhatsAppTemplatesRequest>;

    const result = await client.listTemplates(request);

    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(Array.isArray(result.data)).toBe(true);

    const template = result.data[0];
    expect(template.id).toBeDefined();
    expect(template.name).toBeDefined();
    expect(template.language).toBeDefined();
    expect(template.category).toBeDefined();
    expect(template.components).toBeDefined();
    expect(Array.isArray(template.components)).toBe(true);

    if (result.paging) {
      expect(result.paging.cursors).toBeDefined();
      expect(result.paging.cursors.before).toBeDefined();
      expect(result.paging.cursors.after).toBeDefined();
    }
  }, 25000);

  test("should list templates with name filter", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const request = {
      wabaId: loadRequiredEnvVar("WHATSAPP_WABA_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        name: "order_confirmation",
      },
    } satisfies WhatsAppTemplateRequest<ListWhatsAppTemplatesRequest>;

    const result = await client.listTemplates(request);

    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(Array.isArray(result.data)).toBe(true);

    result.data.forEach((template) => {
      expect(template.name).toContain("order_confirmation");
    });
  }, 25000);

  test("should list templates with category filter", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const request = {
      wabaId: loadRequiredEnvVar("WHATSAPP_WABA_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        category: "UTILITY",
      },
    } satisfies WhatsAppTemplateRequest<ListWhatsAppTemplatesRequest>;

    const result = await client.listTemplates(request);

    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(Array.isArray(result.data)).toBe(true);

    result.data.forEach((template) => {
      expect(template.category).toBe("UTILITY");
    });
  }, 25000);

  test("should list templates with status filter", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const request = {
      wabaId: loadRequiredEnvVar("WHATSAPP_WABA_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        status: "APPROVED",
      },
    } satisfies WhatsAppTemplateRequest<ListWhatsAppTemplatesRequest>;

    const result = await client.listTemplates(request);

    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(Array.isArray(result.data)).toBe(true);

    result.data.forEach((template) => {
      expect(template.status).toBe("APPROVED");
    });
  }, 25000);

  test("should list templates with multiple filters", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const request = {
      wabaId: loadRequiredEnvVar("WHATSAPP_WABA_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        category: "MARKETING",
        status: "APPROVED",
        language: "en",
      },
    } satisfies WhatsAppTemplateRequest<ListWhatsAppTemplatesRequest>;

    const result = await client.listTemplates(request);

    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(Array.isArray(result.data)).toBe(true);

    result.data.forEach((template) => {
      expect(template.category).toBe("MARKETING");
      expect(template.status).toBe("APPROVED");
      expect(template.language).toBe("en");
    });
  }, 25000);

  test("should handle empty template list", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const request = {
      wabaId: loadRequiredEnvVar("WHATSAPP_WABA_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        name: "nonexistent_template_name_xyz",
      },
    } satisfies WhatsAppTemplateRequest<ListWhatsAppTemplatesRequest>;

    const result = await client.listTemplates(request);

    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBe(0);
  }, 25000);

  test("should delete a template by name", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const createRequest = {
      wabaId: loadRequiredEnvVar("WHATSAPP_WABA_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        name: `delete_test_template${TEMPLATES_VERSION}`,
        language: "en",
        category: "UTILITY",
        components: [
          {
            type: "BODY",
            text: "This is a test template that will be deleted.",
          },
        ],
      },
    } satisfies WhatsAppTemplateRequest<CreateWhatsAppTemplateRequest>;

    const createResult = await client.createTemplate(createRequest);
    expect(createResult).toBeDefined();
    expect(typeof createResult.id).toBe("string");

    const deleteRequest = {
      wabaId: loadRequiredEnvVar("WHATSAPP_WABA_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        name: `delete_test_template${TEMPLATES_VERSION}`,
      },
    } satisfies WhatsAppTemplateRequest<DeleteWhatsAppTemplateRequest>;

    const result = await client.deleteTemplate(deleteRequest);

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  }, 25000);

  test("should delete a template by name and hsm_id", async () => {
    const adapter = new ReplayWhatsAppHttpAdapter();
    const client = new WhatsAppClient(adapter);

    const createRequest = {
      wabaId: loadRequiredEnvVar("WHATSAPP_WABA_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        name: `delete_test_with_id${TEMPLATES_VERSION}`,
        language: "en",
        category: "UTILITY",
        components: [
          {
            type: "BODY",
            text: "This is another test template that will be deleted with hsm_id.",
          },
        ],
      },
    } satisfies WhatsAppTemplateRequest<CreateWhatsAppTemplateRequest>;

    const createResult = await client.createTemplate(createRequest);
    expect(createResult).toBeDefined();
    expect(typeof createResult.id).toBe("string");

    const deleteRequest = {
      wabaId: loadRequiredEnvVar("WHATSAPP_WABA_ID"),
      accessToken: loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN"),
      payload: {
        name: `delete_test_with_id${TEMPLATES_VERSION}`,
        hsm_id: createResult.id,
      },
    } satisfies WhatsAppTemplateRequest<DeleteWhatsAppTemplateRequest>;

    const result = await client.deleteTemplate(deleteRequest);

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  }, 25000);
});
