import { env } from "./env.ts";
import { getDailySummary } from "./garmin_api.ts";

export async function getDailySummaryCron() {
  const data = await getDailySummary(env.GARMIN_USER_GUID);
  console.log(`getDailySummaryCron:`, data);

  // TODO: store daily summary in db (once per hour)

  // TODO: Send telegram message
}
