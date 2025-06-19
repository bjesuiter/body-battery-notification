/**
 * The api i use to speak with the telegram bot to send notifications
 * 
 * Request format: https://api.telegram.org/bot<token>/METHOD_NAME
 */

import { env } from "./env.ts";

const baseUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}`;