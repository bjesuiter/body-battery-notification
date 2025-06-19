// import { getBotUpdates } from "../src/bot_api.ts";

import { sendMessage } from "../src/bot_api.ts";
import { env } from "../src/env.ts";

if (import.meta.main) {

    // Step 1 - get the userId and chat id of my bjesuiter user to be able to send messages to him
    // => already done
    // const updates = await getBotUpdates();
    // console.log(updates);

    // Step 2 - send a message to the user
    const result = await sendMessage(env.TELEGRAM_CHAT_ID, "Hello, world!");
    console.log(result);
}