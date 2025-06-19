import { Router, v } from "@oak/acorn";
import { getTelegramWebhookSettings, storeAuth } from "../db.ts";
import { getDailySummary, refreshTokens } from "../garmin_api.ts";
import { env } from "../env.ts";
import { handleBotCommand, sendMessage, sendSuccess } from "../bot_api.ts";
import { contentType } from "jsr:@std/media-types@1/content-type";

/**
 * oak/acorn docs: https://jsr.io/@oak/acorn
 */
export const router = new Router();

router.get("/", () => ({ hello: "world" }));

router.post("/telegram/updates", async (ctx) => {
  const currentSecretToken = ctx.request.headers.get(
    "X-Telegram-Bot-Api-Secret-Token",
  );
  const { secretToken: storedSecretToken } = await getTelegramWebhookSettings();

  // validate secret token
  if (currentSecretToken !== storedSecretToken) {
    ctx.throw(403, "Forbidden: Invalid secret token");
    console.error(`Received update from telegram but secret token is invalid`, {
      currentSecretToken,
      storedSecretToken,
    });
    return;
  }

  // log the update message (for debugging and insights)
  const reqBody = await ctx.body() as {
    message?: {
      text: string;
      entities?: Array<{
        type: string;
        offset: number;
        length: number;
      }>;
    };
  };
  console.log(`Received update from telegram`, {
    reqBody,
  });

  // handle the message
  if (reqBody.message) {
    const message = reqBody.message;

    if (message?.entities?.some((entity) => entity.type === "bot_command")) {
      const commandEntity = message.entities.find((entity) =>
        entity.type === "bot_command"
      );
      if (commandEntity) {
        const command = message.text.slice(
          commandEntity.offset,
          commandEntity.offset + commandEntity.length,
        );
        await handleBotCommand(command, message);
      }
      return;
    }

    sendMessage(
      env.TELEGRAM_CHAT_ID,
      "I'm sorry, I got this message, but I can only handle commands",
    );
  }

  sendMessage(env.TELEGRAM_CHAT_ID, "I'm sorry, I can only handle commands");
});

// manual routes - remove once telegram integration is working

router.get("/set-auth", async (ctx) => {
  const { jwtFgp, refreshToken } = await ctx.queryParams();
  if (!jwtFgp || !refreshToken) {
    ctx.throw(400, "jwtFgp and refreshToken are required");
    return;
  }
  try {
    const newAuth = await refreshTokens({ jwtFgp, refreshToken });
    console.debug(`Refreshed auth:`, newAuth);
    return {
      message:
        "Auth (jwtFgp, refreshToken and accessToken) refreshed successfully",
    };
  } catch (error) {
    ctx.throw(500, "Failed to refresh tokens");
    console.error(`Failed to refresh tokens`, error);
    return;
  }
});

// router.get("/get-daily-summary", async (ctx) => {
//   try {
//     const dailySummary = await getDailySummary(env.GARMIN_USER_GUID);
//     sendSuccess(
//       env.TELEGRAM_CHAT_ID,
//       "DEBUG: Daily summary fetched successfully",
//     );
//     return { dailySummary };
//   } catch (error) {
//     ctx.throw(500, "Failed to get daily summary");
//     console.error(`Failed to get daily summary`, error);
//     return;
//   }
// });
