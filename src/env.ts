import { z } from "zod";

const envSchema = z.object({
    JWT_FGP: z.string(),
    REFRESH_TOKEN: z.string(),
    GARMIN_USER_GUID: z.string(),
    TELEGRAM_BOT_TOKEN: z.string(),
    TELEGRAM_USER_ID: z.string(),
    TELEGRAM_CHAT_ID: z.string(),
})

const envRaw = {
    JWT_FGP: Deno.env.get("JWT_FGP"),
    REFRESH_TOKEN: Deno.env.get("REFRESH_TOKEN"),
    GARMIN_USER_GUID: Deno.env.get("GARMIN_USER_GUID"),
    TELEGRAM_BOT_TOKEN: Deno.env.get("TELEGRAM_BOT_TOKEN"),
    TELEGRAM_USER_ID: Deno.env.get("TELEGRAM_USER_ID"),
    TELEGRAM_CHAT_ID: Deno.env.get("TELEGRAM_CHAT_ID"),
}

export const env = envSchema.parse(envRaw);
export type Env = z.infer<typeof envSchema>;