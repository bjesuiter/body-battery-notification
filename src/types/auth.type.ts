import { z } from "zod";

export const AuthSchema = z.object({
    jwtFgp: z.string(),
    refreshToken: z.string(),
});

export type Auth = z.infer<typeof AuthSchema>;