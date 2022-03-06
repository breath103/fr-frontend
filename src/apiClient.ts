import { Client } from "./api/generated";

export const frApi = new Client({ ["x-fr-auth-token"]: "guest:12345-12345" });
