import { getOrInitAuth } from "./src/db.ts";
import { env } from "./src/env.ts";
import { getDailySummary, refreshTokens } from "./src/garmin-api.ts";

Deno.cron("Log a message", { hour: { every: 1 } }, () => {
    console.log("This will print once an hour.");
  });

// const auth = await getOrInitAuth();

// const newAuth = await refreshTokens({
//     jwtFgp: auth.jwtFgp,
//     refreshToken: auth.refreshToken,
// });

const result = await getDailySummary(env.USER_GUID).catch((error) => {
    console.error(error);
    return null;
});

if (result) {
    console.log(result);
}