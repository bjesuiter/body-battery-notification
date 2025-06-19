import { router } from "./src/api/router.ts";
import { registerWebhook } from "./src/bot_api.ts";
import { getDailySummaryCron } from "./src/cron.ts";
import { env } from "./src/env.ts";
import { getDailySummary, refreshTokens } from "./src/garmin_api.ts";

// Step 1: register Telegram bot webhook for receiving updates
await registerWebhook();

// Deno.cron(
//   "get_garmin_daily_summary_per_hour",
//   { hour: { every: 1 } },
//   getDailySummaryCron,
// );

// refreshTokens({
//   jwtFgp: env.JWT_FGP,
//   refreshToken: env.REFRESH_TOKEN,
// });

// // run once immediately on deployment
// getDailySummaryCron();

// CAUTION: authenticate routes properly!
router.listen({ port: 8080 });

console.log(`Server is running on port 8080
    http://localhost:8080
`);
