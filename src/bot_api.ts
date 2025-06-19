/**
 * The api i use to speak with the telegram bot to send notifications
 *
 * Request format: https://api.telegram.org/bot<token>/METHOD_NAME
 */

import ky from "ky";
import { env } from "./env.ts";
import { randomUUID } from "node:crypto";
import { storeTelegramWebhookSettings } from "./db.ts";

export const baseUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}`;

export async function getBotUpdates() {
  const response = await ky.get(`${baseUrl}/getUpdates`);
  return await response.json();
}

export async function sendMessage(chatId: string, text: string) {
  const response = await ky.post(`${baseUrl}/sendMessage`, {
    json: {
      chat_id: chatId,
      text,
    },
  });
  return await response.json();
}

export function sendInfo(chatId: string, text: string) {
  return sendMessage(chatId, `ℹ️ ${text}`);
}

export function sendError(chatId: string, text: string) {
  return sendMessage(chatId, `❌ ${text}`);
}

export function sendWarning(chatId: string, text: string) {
  return sendMessage(chatId, `⚠️ ${text}`);
}

export function sendSuccess(chatId: string, text: string) {
  return sendMessage(chatId, `✅ ${text}`);
}

export async function registerWebhook() {
  const webhookUrl = `https://jb-body-battery-bot.deno.dev/telegram/updates`;
  const telegramSecretWebhookToken = randomUUID();
  const response = await ky.post(`${baseUrl}/setWebhook`, {
    json: {
      url: webhookUrl,
      secret_token: telegramSecretWebhookToken,
    },
  });

  if (response.status !== 200) {
    sendError(
      env.TELEGRAM_CHAT_ID,
      `Failed to register webhook: ${response.status} ${response.text}`,
    );
    throw new Error(`Failed to register webhook: ${response.status}`);
  }

  await storeTelegramWebhookSettings({
    secretToken: telegramSecretWebhookToken,
  });

  sendSuccess(env.TELEGRAM_CHAT_ID, "DEBUG: Webhook registered successfully");
}

export async function getWebhookInfo() {
  const response = await ky.get(`${baseUrl}/getWebhookInfo`);
  return await response.json() as {
    ok: boolean;
    result: {
      url: string;
    };
  };
}

export async function ensureWebhookRegistration() {
  const webhookInfo = await getWebhookInfo();
  if (
    !webhookInfo.ok || !webhookInfo.result.url || webhookInfo.result.url === ""
  ) {
    await registerWebhook();
  }
}

export async function setCommands() {
  const response = await ky.post(`${baseUrl}/setMyCommands`, {
    json: {
      commands: [
        { command: "start", description: "Start the bot - noop right now" },
        { command: "help", description: "Get help for the available commands" },
        {
          command: "get_daily_summary",
          description: "Gets the garmin 'daily summary' now",
        },
        {
          command: "reauth_garmin",
          description: "Re-authenticates the garmin account",
        },
      ],
    },
  });
  return await response.json();
}

export async function handleBotCommand(command: string, message: unknown) {
  console.info(`Received bot command: ${command}`);
  switch (command) {
    case "/start":
      await sendMessage(env.TELEGRAM_CHAT_ID, "Hello, world!");
      break;
    case "/help":
      await sendMessage(env.TELEGRAM_CHAT_ID, "Help!");
      break;
  }
}
