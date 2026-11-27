import { makeRouteHandler } from "@keystatic/next/route-handler";
import keystaticConfig, { editorEnabled } from "../../../../../keystatic.config";

// API for the website editor (/keystatic). Off in production builds that
// have no Keystatic Cloud project (local mode only works with `pnpm dev`).
const handler = makeRouteHandler({ config: keystaticConfig });
const off = () => new Response("Not found", { status: 404 });

export const GET = editorEnabled ? handler.GET : off;
export const POST = editorEnabled ? handler.POST : off;
