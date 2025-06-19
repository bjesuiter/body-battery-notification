import { getDailySummaryCron } from "./src/cron.ts";
import { env } from "./src/env.ts";
import { getDailySummary } from "./src/garmin-api.ts";

Deno.cron("get_garmin_daily_summary_per_hour", { hour: { every: 1 } }, getDailySummaryCron);

const result = await getDailySummary(env.GARMIN_USER_GUID).catch((error) => {
    console.error(error);
    return null;
});

if (result) {
    console.log(result);
}