import ky from "ky";
import { getOrInitAuth, storeAuth } from "./db.ts";
import { Auth } from "./types/auth.type.ts";

export async function refreshTokens(auth: Omit<Auth, "accessToken">) {
    const response = await ky.post("https://connect.garmin.com/services/auth/token/refresh", {
        json: {
            "refresh_token": auth.refreshToken,
        },
        headers: {
            "Cookie": `JWT_FGP=${auth.jwtFgp}`,
        }
    });

    // get cookies in the form of ["name1=value1", "name2=value2"]
    const cookies = response.headers.getSetCookie() ?? [];
    const newJwtFgp = cookies.find(cookie => cookie.startsWith("JWT_FGP="))?.split("=")[1] ?? "";

    // get the access token
    const data = await response.json() as { access_token: string, refresh_token: string };
    const newRefreshToken = data.refresh_token;
    const newAccessToken = data.access_token;

    const newAuth = {
        jwtFgp: newJwtFgp,
        refreshToken: newRefreshToken,
        accessToken: newAccessToken,
    };

    const storeResult = await storeAuth(newAuth);

    if (!storeResult.ok) {
        throw new Error("Failed to store auth");
    }
    
    // return the new auth
    return newAuth;
}

export async function getDailySummary(userGuid: string) {
    const auth = await getOrInitAuth();

    // Example URL 
    // https://connect.garmin.com/usersummary-service/usersummary/daily/653930b5-079a-4685-a95f-5a9794a90269?calendarDate=2025-06-19
    const response = await ky.get(`https://connect.garmin.com/usersummary-service/usersummary/daily/${userGuid}?calendarDate=${new Date().toISOString().split("T")[0]}`, {
        headers: {
            "Cookie": `JWT_FGP=${auth.jwtFgp}`,
            "DI-Backend": "connectapi.garmin.com",
            "Authorization": `Bearer ${auth.accessToken}`,
        }
    });

    const data = await response.json();

    return data;
}