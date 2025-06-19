import { env } from "./env.ts";
import { refreshTokens } from "./garmin-api.ts";
import { Auth } from "./types/auth.type.ts";

// NOTE: non default databases are not supported on Deno Deploy right now (2025-06-19)
const kv = await Deno.openKv();

// Deno KV quick start docs: https://docs.deno.com/deploy/kv/manual/

export async function storeAuth(newAuth: Auth) {
  const result = await kv.set(["auth"], newAuth);
  if (!result.ok) {
    throw new Error("Failed to store auth");
  }
  return result;
}

export async function getOrInitAuth() {
  const result = await kv.get<Auth>(["auth"]);

  if (!result.value) {
    console.debug(
      "No auth found in Deno.kv, getting tokens from env + refreshing",
    );
    const newAuth = await refreshTokens({
      jwtFgp: env.JWT_FGP,
      refreshToken: env.REFRESH_TOKEN,
    });
    // await storeAuth(newAuth);
    return newAuth;
  }

  return result.value;
}

export async function storeDailySummary(
  dailySummaryRaw: Record<string, unknown>,
  receivedAt: Date,
) {
  // store the daily summary for each receivedAt part in the key since this makes filtering a lot easier!
  const result = await kv.set([
    "daily_summary",
    receivedAt.getUTCFullYear(),
    receivedAt.getUTCMonth(),
    receivedAt.getUTCDate(),
    receivedAt.getUTCHours(),
    receivedAt.getUTCMinutes(),
    receivedAt.getUTCSeconds(),
  ], {
    dailySummaryRaw,
  });
  if (!result.ok) {
    throw new Error("Failed to store daily summary");
  }
  return result;
}
