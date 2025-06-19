import { z } from "zod";

const envSchema = z.object({
    JWT_FGP: z.string(),
    REFRESH_TOKEN: z.string(),
})

const envRaw = {
    JWT_FGP: Deno.env.get("JWT_FGP"),
    REFRESH_TOKEN: Deno.env.get("REFRESH_TOKEN"),
}

export const env = envSchema.parse(envRaw);
export type Env = z.infer<typeof envSchema>;