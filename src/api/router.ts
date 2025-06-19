import { Router, v } from "@oak/acorn";
import { storeAuth } from "../db.ts";
import { getDailySummary, refreshTokens } from "../garmin_api.ts";
import { env } from "../env.ts";
import { sendSuccess } from "../bot_api.ts";
import { contentType } from "jsr:@std/media-types@1/content-type";

/**
 * oak/acorn docs: https://jsr.io/@oak/acorn
 */
export const router = new Router();

router.get("/", () => ({ hello: "world" }));

router.post("/telegram/updates", async (ctx) => {
  const secretToken = ctx.request.headers.get(
    "X-Telegram-Bot-Api-Secret-Token",
  );
  const reqBody = await ctx.body();
  console.log(`Received update from telegram`, {
    secretToken,
    reqBody,
  });
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

router.get("/get-daily-summary", async (ctx) => {
  try {
    const dailySummary = await getDailySummary(env.GARMIN_USER_GUID);
    sendSuccess(
      env.TELEGRAM_CHAT_ID,
      "DEBUG: Daily summary fetched successfully",
    );
    return { dailySummary };
  } catch (error) {
    ctx.throw(500, "Failed to get daily summary");
    console.error(`Failed to get daily summary`, error);
    return;
  }
});
