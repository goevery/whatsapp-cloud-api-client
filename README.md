# WhatsApp Cloud API Client

[![npm version](https://img.shields.io/npm/v/@goevery/whatsapp-cloud-api-client.svg)](https://www.npmjs.com/package/@goevery/whatsapp-cloud-api-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A TypeScript client for the [WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api) with full type safety using Zod schemas.

## Features

- 🔒 **Type-safe** - Built with TypeScript and Zod for runtime validation
- 📦 **Lightweight** - Minimal dependencies (only Zod)
- 🎯 **Simple API** - Intuitive and easy-to-use interface
- 🔌 **Flexible** - Custom HTTP adapter support
- ✅ **Comprehensive** - Supports messages, templates, media, and more
- 📝 **Well-typed** - Full TypeScript definitions included

## Installation

```bash
npm install @goevery/whatsapp-cloud-api-client
```

```bash
pnpm add @goevery/whatsapp-cloud-api-client
```

```bash
yarn add @goevery/whatsapp-cloud-api-client
```

## Quick Start

```typescript
import { WhatsAppClient, FetchWhatsAppHttpAdapter } from "@goevery/whatsapp-cloud-api-client";

// Initialize the client
const client = new WhatsAppClient(new FetchWhatsAppHttpAdapter());

// Send a text message
const response = await client.sendMessage({
  phoneNumberId: "YOUR_PHONE_NUMBER_ID",
  accessToken: "YOUR_ACCESS_TOKEN",
  payload: {
    messaging_product: "whatsapp",
    to: "1234567890",
    type: "text",
    text: {
      body: "Hello from WhatsApp Cloud API!",
    },
  },
});

console.log(response);
```

## Usage

### Sending Messages

#### Text Message

```typescript
await client.sendMessage({
  phoneNumberId: "YOUR_PHONE_NUMBER_ID",
  accessToken: "YOUR_ACCESS_TOKEN",
  payload: {
    messaging_product: "whatsapp",
    to: "1234567890",
    type: "text",
    text: {
      body: "Hello World!",
      preview_url: false,
    },
  },
});
```

#### Image Message

```typescript
await client.sendMessage({
  phoneNumberId: "YOUR_PHONE_NUMBER_ID",
  accessToken: "YOUR_ACCESS_TOKEN",
  payload: {
    messaging_product: "whatsapp",
    to: "1234567890",
    type: "image",
    image: {
      link: "https://example.com/image.jpg",
      caption: "Check out this image!",
    },
  },
});
```

#### Template Message

```typescript
await client.sendMessage({
  phoneNumberId: "YOUR_PHONE_NUMBER_ID",
  accessToken: "YOUR_ACCESS_TOKEN",
  payload: {
    messaging_product: "whatsapp",
    to: "1234567890",
    type: "template",
    template: {
      name: "hello_world",
      language: {
        code: "en_US",
        policy: "deterministic",
      },
    },
  },
});
```



### Managing Templates

#### List Templates

```typescript
const templates = await client.listTemplates({
  wabaId: "YOUR_WABA_ID",
  accessToken: "YOUR_ACCESS_TOKEN",
  payload: {
    status: "APPROVED",
  },
});
```

#### Create Template

```typescript
const template = await client.createTemplate({
  wabaId: "YOUR_WABA_ID",
  accessToken: "YOUR_ACCESS_TOKEN",
  payload: {
    name: "my_template",
    language: "en_US",
    category: "MARKETING",
    components: [
      {
        type: "BODY",
        text: "Hello {{1}}, welcome to our service!",
      },
    ],
  },
});
```

#### Delete Template

```typescript
const result = await client.deleteTemplate({
  wabaId: "YOUR_WABA_ID",
  accessToken: "YOUR_ACCESS_TOKEN",
  payload: {
    name: "my_template",
  },
});
```

### Media Operations

#### Upload Media

```typescript
const file = new File(["content"], "image.jpg", { type: "image/jpeg" });

const media = await client.uploadMedia({
  phoneNumberId: "YOUR_PHONE_NUMBER_ID",
  accessToken: "YOUR_ACCESS_TOKEN",
  file: file,
  payload: {
    messaging_product: "whatsapp",
    type: "image",
  },
});

console.log(media.id); // Use this ID to send the media
```

#### Get Media URL

```typescript
const mediaUrl = await client.getMediaUrl(
  "MEDIA_ID",
  "YOUR_ACCESS_TOKEN"
);

console.log(mediaUrl.url);
```

#### Download Media

```typescript
const media = await client.downloadMedia(
  "https://lookaside.fbsbx.com/...",
  "YOUR_ACCESS_TOKEN"
);

// media.data is a ReadableStream<Uint8Array>
// media.contentType contains the MIME type
```

## Schema Exports

All Zod schemas are exported and can be imported separately:

```typescript
import {
  sendMessageRequestSchema,
  sendMessageResponseSchema,
  type SendMessageRequest,
  type SendMessageResponse,
} from "@goevery/whatsapp-cloud-api-client/schema";

// Validate your own data
const validatedMessage = sendMessageRequestSchema.parse(messageData);
```



## Development

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck

# Lint
pnpm lint
```

## Example

See the [example](./example) directory for a complete working example.

```bash
# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Run the example
pnpm --filter example dev
```

## Requirements

- Node.js 18 or higher
- WhatsApp Business Account
- WhatsApp Business App ID and Phone Number ID
- Access Token from Meta Developer Platform



## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)

## Author

Juan Marín - [@goevery](https://github.com/goevery)

## Links

- [GitHub Repository](https://github.com/goevery/whatsapp-cloud-api-client)
- [NPM Package](https://www.npmjs.com/package/@goevery/whatsapp-cloud-api-client)
- [WhatsApp Cloud API Documentation](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [Issue Tracker](https://github.com/goevery/whatsapp-cloud-api-client/issues)