import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth";
import { isConnectionError, markMongoClosed } from "@/lib/mongodb";

// Better Auth reports database failures as a 500 response. When that happens because the Mongo
// connection died, rebuild it and replay the request once (the body is cloned first).
async function handle(request: Request, method: "GET" | "POST") {
  const replay = request.clone();
  const res = await toNextJsHandler(getAuth())[method](request);
  if (res.status !== 500) return res;
  const body = await res.clone().text().catch(() => "");
  if (!isConnectionError({ message: body }) && !/internal server error/i.test(body) && body !== "") return res;
  markMongoClosed();
  return toNextJsHandler(getAuth())[method](replay);
}

export const GET = (request: Request) => handle(request, "GET");
export const POST = (request: Request) => handle(request, "POST");
