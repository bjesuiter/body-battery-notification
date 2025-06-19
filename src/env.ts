import { z } from "zod";

const envSchema = z.object({
    TEST: z.string(),
})

const envRaw = {
    TEST: Deno.env.get("TEST"),
}

export const env = envSchema.parse(envRaw);
export type Env = z.infer<typeof envSchema>;