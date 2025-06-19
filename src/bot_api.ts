/**
 * The api i use to speak with the telegram bot to send notifications
 *
 * Request format: https://api.telegram.org/bot<token>/METHOD_NAME
 */

import ky from "ky";
import { env } from "./env.ts";

const baseUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}`;

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
