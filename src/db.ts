import { Auth } from "./types/auth.type.ts";

const kv = await Deno.openKv();

// Deno KV quick start docs: https://docs.deno.com/deploy/kv/manual/

export async function storeAuth(newAuth: Auth){
    const result = await kv.set(["auth"], newAuth);
    if (!result.ok) {
        throw new Error("Failed to store auth");
    }
    return result;
}

export async function getAuth(){
    const result = await kv.get<Auth>(["auth"]);
    return result.value;
}