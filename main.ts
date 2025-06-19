import { getDailySummaryCron } from "./src/cron.ts";
import { env } from "./src/env.ts";
import { getDailySummary } from "./src/garmin-api.ts";

Deno.cron("get_garmin_daily_summary_per_hour", { hour: { every: 1 } }, getDailySummaryCron);

// TODO: Add rest api to get data from the specific deno kv out + more analytics 
// CAUTION: authenticate correctly!