import "dotenv/config";
import { WhatsAppClient } from "../src";
import { FetchWhatsAppHttpAdapter } from "../src/adapter";

async function main() {
  const whatsAppWabaId = loadRequiredEnvVar("WHATSAPP_WABA_ID");
  const whatsAppAccessToken = loadRequiredEnvVar("WHATSAPP_ACCESS_TOKEN");

  const client = new WhatsAppClient(new FetchWhatsAppHttpAdapter());
  const response = await client.listTemplates({
    wabaId: whatsAppWabaId,
    accessToken: whatsAppAccessToken,
    payload: {
      status: "APPROVED",
    },
  });

  console.log(JSON.stringify(response, null, 2));
}

function loadRequiredEnvVar(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }

  return value;
}

void main();
