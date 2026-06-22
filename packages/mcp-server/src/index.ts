import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import fs from 'fs';
import path from 'path';
import os from 'os';

const API_URL = process.env.WIZPAY_API_URL || 'https://pay.unwiz.ai/api';

function getApiKey(): string {
  // 1. Try local config file first
  try {
    const home = os.homedir();
    const configPath = path.join(home, '.wizpay', 'config.json');
    if (fs.existsSync(configPath)) {
      const data = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (data.apiKey) return data.apiKey;
    }
  } catch (e) {
    // Ignore error and fall back
  }

  // 2. Fall back to environment variable
  const envKey = process.env.WIZPAY_API_KEY;
  if (envKey) return envKey;

  throw new Error('WizPay API Key is not configured. Please run `npx @jedmamosto/wizpay-mcp-setup` to configure it.');
}

// Zod schemas for validation inside MCP Server
const ProductSchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  productDescription: z.string().optional().default(''),
  productPrice: z.number().min(20, 'Minimum price is PHP 20.00'),
});

const CustomColorsSchema = z.object({
  background: z.string().optional(),
  card: z.string().optional(),
  text: z.string().optional(),
  textMuted: z.string().optional(),
  accent: z.string().optional(),
  buttonBg: z.string().optional(),
  buttonText: z.string().optional(),
  buttonHoverBg: z.string().optional(),
  inputBg: z.string().optional(),
  inputBorder: z.string().optional(),
  inputFocusRing: z.string().optional(),
  borderColor: z.string().optional(),
});

const AppearanceSchema = z.object({
  colorScheme: z.enum(['slate', 'azure', 'emerald', 'ruby', 'amethyst', 'amber', 'custom']).optional().default('slate'),
  fontFamily: z.string().optional().default('inter'),
  customColors: CustomColorsSchema.optional(),
  borderRadius: z.string().optional(),
  cardBorderWidth: z.string().optional(),
  buttonShape: z.enum(['sharp', 'rounded', 'pill']).optional(),
  shadowSize: z.enum(['none', 'sm', 'md', 'lg', 'xl', '2xl']).optional(),
  customCSS: z.string().optional(),
  layout: z.enum(['single-column', 'split']).optional().default('single-column'),
  showMerchantBadge: z.boolean().optional().default(true),
  showProductDescription: z.boolean().optional().default(true),
  checkoutButtonText: z.string().optional(),
});

const CreateFormSchema = z.object({
  paymentFormTitle: z.string().min(1, 'Title is required'),
  paymentFormDescription: z.string().min(1, 'Description is required'),
  paymentFormSuccessURL: z.string().url('Success URL must be a valid URL'),
  paymentFormCancelURL: z.string().url('Cancel URL must be a valid URL'),
  paymentFormWebhookURL: z.string().url('Webhook URL must be a valid URL').optional().default('https://example.com/webhook'),
  paymentFormPaymongoPubKey: z.string().min(1, 'Paymongo Public Key is required'),
  paymentFormPaymongoSecKey: z.string().min(1, 'Paymongo Secret Key is required'),
  paymentFormProducts: z.array(ProductSchema).min(1, 'At least one product is required'),
  appearance: AppearanceSchema.optional(),
});

const UpdateFormSchema = CreateFormSchema.partial();

// Initialize Server
const server = new Server(
  {
    name: 'wizpay-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);

/**
 * Resources Definition
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'wizpay://schemas/payment-form',
        name: 'WizPay Form Zod Schema',
        description: 'JSON schema definitions for creating and validating payment forms.',
        mimeType: 'application/json',
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  if (request.params.uri === 'wizpay://schemas/payment-form') {
    return {
      contents: [
        {
          uri: request.params.uri,
          mimeType: 'application/json',
          text: JSON.stringify(
            {
              $schema: 'http://json-schema.org/draft-07/schema#',
              title: 'WizPay Payment Form',
              type: 'object',
              required: [
                'paymentFormTitle',
                'paymentFormDescription',
                'paymentFormSuccessURL',
                'paymentFormCancelURL',
                'paymentFormPaymongoPubKey',
                'paymentFormPaymongoSecKey',
                'paymentFormProducts',
              ],
              properties: {
                paymentFormTitle: { type: 'string' },
                paymentFormDescription: { type: 'string' },
                paymentFormSuccessURL: { type: 'string', format: 'uri' },
                paymentFormCancelURL: { type: 'string', format: 'uri' },
                paymentFormWebhookURL: { type: 'string', format: 'uri' },
                paymentFormPaymongoPubKey: { type: 'string' },
                paymentFormPaymongoSecKey: { type: 'string' },
                paymentFormProducts: {
                  type: 'array',
                  minItems: 1,
                  items: {
                    type: 'object',
                    required: ['productName', 'productPrice'],
                    properties: {
                      productName: { type: 'string' },
                      productDescription: { type: 'string' },
                      productPrice: { type: 'number', minimum: 20 },
                    },
                  },
                },
                appearance: {
                  type: 'object',
                  properties: {
                    colorScheme: { enum: ['slate', 'azure', 'emerald', 'ruby', 'amethyst', 'amber', 'custom'] },
                    fontFamily: { type: 'string' },
                    customColors: {
                      type: 'object',
                      properties: {
                        background: { type: 'string' },
                        card: { type: 'string' },
                        text: { type: 'string' },
                        textMuted: { type: 'string' },
                        accent: { type: 'string' },
                        buttonBg: { type: 'string' },
                        buttonText: { type: 'string' },
                        buttonHoverBg: { type: 'string' },
                        inputBg: { type: 'string' },
                        inputBorder: { type: 'string' },
                        inputFocusRing: { type: 'string' },
                        borderColor: { type: 'string' }
                      }
                    },
                    borderRadius: { type: 'string' },
                    cardBorderWidth: { type: 'string' },
                    buttonShape: { enum: ['sharp', 'rounded', 'pill'] },
                    shadowSize: { enum: ['none', 'sm', 'md', 'lg', 'xl', '2xl'] },
                    customCSS: { type: 'string' },
                    layout: { enum: ['single-column', 'split'] },
                    showMerchantBadge: { type: 'boolean' },
                    showProductDescription: { type: 'boolean' },
                    checkoutButtonText: { type: 'string' }
                  },
                },
              },
            },
            null,
            2
          ),
        },
      ],
    };
  }
  throw new Error(`Resource not found: ${request.params.uri}`);
});

/**
 * Tools Definition
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_forms',
        description: 'List all WizPay payment forms for the authenticated merchant.',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'get_form',
        description: 'Get details of a specific payment form (credentials are sanitized/redacted).',
        inputSchema: {
          type: 'object',
          required: ['paymentFormId'],
          properties: {
            paymentFormId: { type: 'string', description: 'The unique ID of the payment form.' },
          },
        },
      },
      {
        name: 'create_form',
        description: 'Create a new payment form on WizPay.',
        inputSchema: {
          type: 'object',
          required: [
            'paymentFormTitle',
            'paymentFormDescription',
            'paymentFormSuccessURL',
            'paymentFormCancelURL',
            'paymentFormPaymongoPubKey',
            'paymentFormPaymongoSecKey',
            'paymentFormProducts',
          ],
          properties: {
            paymentFormTitle: { type: 'string', description: 'Title of the payment portal' },
            paymentFormDescription: { type: 'string', description: 'Subtitle or descriptive copy' },
            paymentFormSuccessURL: { type: 'string', description: 'Redirect URL upon successful transaction' },
            paymentFormCancelURL: { type: 'string', description: 'Go-back link if transaction is abandoned' },
            paymentFormWebhookURL: { type: 'string', description: 'Paymongo Webhook URL for event integration' },
            paymentFormPaymongoPubKey: { type: 'string', description: 'Paymongo Public Key' },
            paymentFormPaymongoSecKey: { type: 'string', description: 'Paymongo Secret Key' },
            paymentFormProducts: {
              type: 'array',
              description: 'Products available for purchase in this checkout portal',
              items: {
                type: 'object',
                properties: {
                  productName: { type: 'string' },
                  productDescription: { type: 'string' },
                  productPrice: { type: 'number', description: 'Price in PHP (minimum 20.00)' },
                },
              },
            },
            appearance: {
              type: 'object',
              properties: {
                colorScheme: { type: 'string', enum: ['slate', 'azure', 'emerald', 'ruby', 'amethyst', 'amber', 'custom'] },
                fontFamily: { type: 'string' },
                customColors: {
                  type: 'object',
                  properties: {
                    background: { type: 'string' },
                    card: { type: 'string' },
                    text: { type: 'string' },
                    textMuted: { type: 'string' },
                    accent: { type: 'string' },
                    buttonBg: { type: 'string' },
                    buttonText: { type: 'string' },
                    buttonHoverBg: { type: 'string' },
                    inputBg: { type: 'string' },
                    inputBorder: { type: 'string' },
                    inputFocusRing: { type: 'string' },
                    borderColor: { type: 'string' }
                  }
                },
                borderRadius: { type: 'string' },
                cardBorderWidth: { type: 'string' },
                buttonShape: { type: 'string', enum: ['sharp', 'rounded', 'pill'] },
                shadowSize: { type: 'string', enum: ['none', 'sm', 'md', 'lg', 'xl', '2xl'] },
                customCSS: { type: 'string' },
                layout: { type: 'string', enum: ['single-column', 'split'] },
                showMerchantBadge: { type: 'boolean' },
                showProductDescription: { type: 'boolean' },
                checkoutButtonText: { type: 'string' }
              },
            },
          },
        },
      },
      {
        name: 'update_form',
        description: 'Update metadata, products, or appearance configuration of an existing payment form.',
        inputSchema: {
          type: 'object',
          required: ['paymentFormId'],
          properties: {
            paymentFormId: { type: 'string' },
            paymentFormTitle: { type: 'string' },
            paymentFormDescription: { type: 'string' },
            paymentFormSuccessURL: { type: 'string' },
            paymentFormCancelURL: { type: 'string' },
            paymentFormWebhookURL: { type: 'string' },
            paymentFormProducts: { type: 'array' },
            appearance: { type: 'object' },
          },
        },
      },
      {
        name: 'get_embed_code',
        description: 'Get the exact HTML/React code snippet to embed a payment form on another website.',
        inputSchema: {
          type: 'object',
          required: ['paymentFormId', 'framework'],
          properties: {
            paymentFormId: { type: 'string', description: 'The unique ID of the payment form.' },
            framework: { type: 'string', enum: ['html', 'react'], description: 'The target codebase framework.' },
          },
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_forms': {
        const response = await fetch(`${API_URL}/payment-forms`, {
          headers: { Authorization: `Bearer ${getApiKey()}` },
        });
        if (!response.ok) {
          const body = await response.text();
          throw new Error(`WizPay API responded with status ${response.status}: ${body}`);
        }
        const data = await response.json();
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      case 'get_form': {
        const { paymentFormId } = args as { paymentFormId: string };
        const response = await fetch(`${API_URL}/payment-forms/query?paymentFormId=${paymentFormId}`, {
          headers: { Authorization: `Bearer ${getApiKey()}` },
        });
        if (!response.ok) {
          const body = await response.text();
          throw new Error(`WizPay API responded with status ${response.status}: ${body}`);
        }
        const data = await response.json();
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      case 'create_form': {
        const parsed = CreateFormSchema.parse(args);
        const response = await fetch(`${API_URL}/payment-forms`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getApiKey()}`,
          },
          body: JSON.stringify(parsed),
        });
        if (!response.ok) {
          const body = await response.text();
          throw new Error(`WizPay API creation failed with status ${response.status}: ${body}`);
        }
        const data = await response.json();
        return { content: [{ type: 'text', text: `Form created successfully: ${JSON.stringify(data, null, 2)}` }] };
      }

      case 'update_form': {
        const { paymentFormId, ...rest } = args as { paymentFormId: string; [key: string]: any };
        const parsed = UpdateFormSchema.parse(rest);
        const response = await fetch(`${API_URL}/payment-forms?paymentFormId=${paymentFormId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getApiKey()}`,
          },
          body: JSON.stringify(parsed),
        });
        if (!response.ok) {
          const body = await response.text();
          throw new Error(`WizPay API update failed with status ${response.status}: ${body}`);
        }
        const data = await response.json();
        return { content: [{ type: 'text', text: `Form updated successfully: ${JSON.stringify(data, null, 2)}` }] };
      }

      case 'get_embed_code': {
        const { paymentFormId, framework } = args as { paymentFormId: string; framework: 'html' | 'react' };
        
        let publicHost = 'https://pay.unwiz.ai';
        if (API_URL) {
          try {
            const url = new URL(API_URL);
            publicHost = url.origin;
          } catch (e) {
            // fallback
          }
        }

        let embedSnippet = '';
        if (framework === 'html') {
          embedSnippet = `<!-- WizPay Checkout Form Embed -->\n<div class="wizpay-storefront" data-form-id="${paymentFormId}"></div>\n<script src="${publicHost}/sdk/wizpay.js" defer></script>`;
        } else if (framework === 'react') {
          embedSnippet = `import React, { useEffect } from 'react';\n\nexport default function WizPayCheckout({ formId }) {\n  useEffect(() => {\n    // Dynamically inject the WizPay SDK script\n    if (!document.querySelector('script[src*="/sdk/wizpay.js"]')) {\n      const script = document.createElement('script');\n      script.src = "${publicHost}/sdk/wizpay.js";\n      script.async = true;\n      script.onload = () => {\n        if (window.WizPay) {\n          window.WizPay.init();\n        }\n      };\n      document.body.appendChild(script);\n    } else if (window.WizPay) {\n      window.WizPay.init();\n    }\n  }, [formId]);\n\n  return <div className="wizpay-storefront" data-form-id={formId} />;\n}`;
        }

        return {
          content: [{
            type: 'text',
            text: embedSnippet
          }]
        };
      }

      default:
        throw new Error(`Tool not found: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [{ type: 'text', text: `Error: ${error.message || error}` }],
      isError: true,
    };
  }
});

/**
 * Prompts Definition
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: 'generate-storefront-form',
        description: 'Helps create a standard storefront checkout form with default styling options.',
      },
    ],
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  if (request.params.name === 'generate-storefront-form') {
    return {
      description: 'Generates a stylized WizPay payment form payload.',
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: 'I want to create a payment form for my brand. Here is my brand name, products list, and primary brand color scheme. Please generate the create_form tool arguments.',
          },
        },
      ],
    };
  }
  throw new Error(`Prompt not found: ${request.params.name}`);
});

// Run using Stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);
console.error('WizPay MCP server running on stdio');
