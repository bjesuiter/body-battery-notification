import ky from "ky";
import { baseUrl } from "../src/bot_api.ts";

const response = await ky.get(`${baseUrl}/getWebhookInfo`);
const result = await response.json();
console.log(result);
