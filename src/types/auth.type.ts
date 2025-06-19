import { z } from "zod";

export const AuthSchema = z.object({
    jwtFgp: z.string(),
    refreshToken: z.string(),
    //  accessToken = bearer token
    accessToken: z.string().optional(),
});

export type Auth = z.infer<typeof AuthSchema>;