import { storeAuth } from "./db.ts";
import { env } from "./env.ts";
import ky from "ky";

export async function refresh_tokens() {
    
    const response = await ky.post("https://connect.garmin.com/services/auth/token/refresh", {
        json: {
            "refresh_token": env.REFRESH_TOKEN,
        },
        headers: {
            "Cookie": `JWT_FGP=${env.JWT_FGP}`,
        }
    });

    // get cookies in the form of ["name1=value1", "name2=value2"]
    const cookies = response.headers.getSetCookie() ?? [];
    const newJwtFgp = cookies.find(cookie => cookie.startsWith("JWT_FGP="))?.split("=")[1] ?? "";

    // get the access token
    const data = await response.json() as { access_token: string, refresh_token: string };
    const newRefreshToken = data.refresh_token;

    const newAuth = {
        jwtFgp: newJwtFgp,
        refreshToken: newRefreshToken,
    };

    const storeResult = await storeAuth(newAuth);

    if (!storeResult.ok) {
        throw new Error("Failed to store auth");
    }
    
    // return the new auth
    return newAuth;
}