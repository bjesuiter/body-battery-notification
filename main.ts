import { env } from "./src/env.ts";
import { getAuth, storeAuth } from "./src/db.ts";

const auth  = await getAuth();

if (!auth) {
    console.debug("No auth found in Deno.kv, getting tokens from env");
    const newAuth = {
        jwtFgp: env.JWT_FGP,
        refreshToken: env.REFRESH_TOKEN,
    };
    await storeAuth(newAuth);
}