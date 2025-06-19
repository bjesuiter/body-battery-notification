import { Router } from "@oak/acorn";

/**
 * oak/acorn docs: https://jsr.io/@oak/acorn
 */
export const router = new Router();

router.get("/", () => ({ hello: "world" }));
