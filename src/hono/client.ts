import { hc } from "hono/client";

import { app } from "./routers/_app";

function getUrl() {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/`;
  return "http://localhost:3000/";
}

export type Client = ReturnType<typeof hc<typeof app>>;

export const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<typeof app>(...args);

export const createClient = (headers?: Headers) =>
  hcWithType(getUrl(), {
    headers: headers ? Object.fromEntries(headers.entries()) : undefined,
  }).api;

export const client = createClient();
