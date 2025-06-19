import ky, { HTTPError } from "ky";
import { getOrInitAuth, storeAuth, storeDailySummary } from "./db.ts";
import { Auth } from "./types/auth.type.ts";
import {
  GarminDailySummaryRaw,
  GarminDailySummaryRawSchema,
} from "./types/garminDailySummary.type.ts";
import { sendError, sendInfo } from "./bot_api.ts";
import { env } from "./env.ts";

export async function refreshTokens(auth: Omit<Auth, "accessToken">) {
  const response = await ky.post(
    "https://connect.garmin.com/services/auth/token/refresh",
    {
      json: {
        "refresh_token": auth.refreshToken,
      },
      headers: {
        "Cookie": `JWT_FGP=${auth.jwtFgp}`,
      },
    },
  );

  // get cookies in the form of ["name1=value1", "name2=value2"]
  const cookies = response.headers.getSetCookie() ?? [];
  const newJwtFgp =
    cookies.find((cookie) => cookie.startsWith("JWT_FGP="))?.split("=")[1] ??
      "";

  // get the access token
  const data = await response.json() as {
    access_token: string;
    refresh_token: string;
  };
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

export async function getDailySummary(
  userGuid: string,
): Promise<GarminDailySummaryRaw | undefined> {
  const auth = await getOrInitAuth();

  // Example URL
  // https://connect.garmin.com/usersummary-service/usersummary/daily/653930b5-079a-4685-a95f-5a9794a90269?calendarDate=2025-06-19
  const response = await ky.get(
    `https://connect.garmin.com/usersummary-service/usersummary/daily/${userGuid}?calendarDate=${
      new Date().toISOString().split("T")[0]
    }`,
    {
      headers: {
        "Cookie": `JWT_FGP=${auth.jwtFgp}`,
        "DI-Backend": "connectapi.garmin.com",
        "Authorization": `Bearer ${auth.accessToken}`,
      },
      retry: {
        limit: 3,
        methods: ["GET"],
        backoffLimit: 10000,
      },
      hooks: {
        beforeRetry: [
          async ({ request, error }: { request: Request; error: Error }) => {
            if (error instanceof HTTPError) {
              if (error.response.status === 403) {
                const infoText =
                  `getDailySummary: failed with 403-Forbidden, refreshing tokens`;
                sendInfo(env.TELEGRAM_CHAT_ID, infoText);
                console.info(infoText);

                const newAuth = await refreshTokens(auth);
                request.headers.set("Cookie", `JWT_FGP=${newAuth.jwtFgp}`);
                request.headers.set(
                  "Authorization",
                  `Bearer ${newAuth.accessToken}`,
                );
              }

              if (error.response.status === 401) {
                const errorText =
                  `getDailySummary: failed with 401-Unauthorized => change the jwtFgp and refreshToken!`;
                sendError(env.TELEGRAM_CHAT_ID, errorText);
                console.error(errorText);
                return ky.stop;
              }
            }

            const errorText =
              `Unknown HTTP ERROR for getDailySummary: ${error}`;
            sendError(env.TELEGRAM_CHAT_ID, errorText);
            console.error(errorText);
          },
        ],
      },
    },
  );

  if (!response.ok) {
    const errorText =
      `getDailySummary: failed with ${response.status} ${response.statusText}`;
    sendError(env.TELEGRAM_CHAT_ID, errorText);
    console.error(errorText);
    return undefined;
  }

  const dataRaw = await response.json();
  const parsed = GarminDailySummaryRawSchema.safeParse(dataRaw);

  if (!parsed.success) {
    const errorText =
      `getDailySummary: failed to parse response as GarminDailySummaryRaw: ${parsed.error}`;
    sendError(env.TELEGRAM_CHAT_ID, errorText);
    console.error(errorText);
    return undefined;
  }

  const receivedAt = new Date();
  storeDailySummary(parsed.data, receivedAt);
  return parsed.data;
}
