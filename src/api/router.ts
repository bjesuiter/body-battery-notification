import { Router, v } from "@oak/acorn";
import { storeAuth } from "../db.ts";
import { refreshTokens } from "../garmin-api.ts";

/**
 * oak/acorn docs: https://jsr.io/@oak/acorn
 */
export const router = new Router();

router.get("/", () => ({ hello: "world" }));

router.get("/set-auth", async (ctx) => {
  const { jwtFgp, refreshToken } = await ctx.queryParams();
  if (!jwtFgp || !refreshToken) {
    ctx.throw(400, "jwtFgp and refreshToken are required");
    return;
  }
  try {
    const newAuth = await refreshTokens({ jwtFgp, refreshToken });
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
