import { env } from "../src/env.ts";
import { getDailySummary } from "../src/garmin-api.ts";

const result = await getDailySummary(env.GARMIN_USER_GUID).catch((error) => {
    console.error(error);
    return null;
});

if (result) {
    console.log(result);
}