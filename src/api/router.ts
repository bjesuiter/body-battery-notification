import { Router } from "@oak/acorn";

export const router = new Router();

router.get("/", () => ({ hello: "world" }));
