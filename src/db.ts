import { env } from "./env.ts";
import { refreshTokens } from "./garmin-api.ts";
import { Auth } from "./types/auth.type.ts";

const kv = await Deno.openKv("./kv.db");

// Deno KV quick start docs: https://docs.deno.com/deploy/kv/manual/

export async function storeAuth(newAuth: Auth){
    const result = await kv.set(["auth"], newAuth);
    if (!result.ok) {
        throw new Error("Failed to store auth");
    }
    return result;
}

export async function getOrInitAuth(){
    const result = await kv.get<Auth>(["auth"]);

    if (!result.value) {
        console.debug("No auth found in Deno.kv, getting tokens from env + refreshing");
        const newAuth = await refreshTokens({
            jwtFgp: env.JWT_FGP,
            refreshToken: env.REFRESH_TOKEN,
        });
        // await storeAuth(newAuth);
        return newAuth;
    }

    return result.value;
}