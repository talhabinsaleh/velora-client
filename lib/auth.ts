import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { ObjectId } from "mongodb";
import { getMongo, isConnectionError, markMongoClosed } from "./mongodb";
import { passwordProblem } from "./validation";

export const BLOCKED_MESSAGE = "Your account has been blocked. Please contact the salon for help.";

async function isBlocked(userId: string) {
  if (!ObjectId.isValid(userId)) return false;
  const user = await getMongo().db.collection("users").findOne({ _id: new ObjectId(userId) }, { projection: { isBlocked: 1 } });
  return user?.isBlocked === true;
}

function createAuth() {
  const { client, db } = getMongo();
  return betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, { client }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      prompt: "select_account",
    },
  },
  account: {
    // Someone who signed up with a password can later use Google with the same address.
    // Google has already confirmed they own that email.
    accountLinking: { enabled: true, trustedProviders: ["google"], requireLocalEmailVerified: false },
  },

  user: {
    // The brief names this collection "users"
    modelName: "users",
    additionalFields: {
      // input: false means a sign-up request can never set these. Admin access is given
      // only by someone with database access (see `npm run make-admin` in the server).
      role: { type: "string", required: false, defaultValue: "customer", input: false },
      isBlocked: { type: "boolean", required: false, defaultValue: false, input: false },
      phone: { type: "string", required: false, defaultValue: "", input: false },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  databaseHooks: {
    session: {
      create: {
        // Blocked customers cannot start a new session, with a password or with Google
        before: async (session) => {
          if (await isBlocked(String(session.userId))) {
            throw new APIError("FORBIDDEN", { message: BLOCKED_MESSAGE });
          }
        },
      },
    },
  },

  hooks: {
    // The form checks the password as well, but the rule must also hold for direct API calls
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") return;
      const problem = passwordProblem(String(ctx.body?.password ?? ""));
      if (problem) throw new APIError("BAD_REQUEST", { message: problem });
      const name = String(ctx.body?.name ?? "").trim();
      if (name.length < 2) throw new APIError("BAD_REQUEST", { message: "Please enter your full name." });
    }),
  },

  plugins: [nextCookies()],
  });
}

export type Auth = ReturnType<typeof createAuth>;
const holder = globalThis as typeof globalThis & { _veloraAuth?: { auth: Auth; client: unknown } };

// Better Auth is bound to one Mongo client. If that client had to be replaced (see mongodb.ts),
// build a fresh Better Auth instance on top of the new one.
export function getAuth(): Auth {
  const { client } = getMongo();
  if (!holder._veloraAuth || holder._veloraAuth.client !== client) {
    holder._veloraAuth = { auth: createAuth(), client };
  }
  return holder._veloraAuth.auth;
}

// Runs a database-backed auth call, and once more on a fresh connection if the old one was dead
export async function withAuth<T>(fn: (auth: Auth) => Promise<T>): Promise<T> {
  try {
    return await fn(getAuth());
  } catch (err) {
    if (!isConnectionError(err)) throw err;
    markMongoClosed();
    return fn(getAuth());
  }
}

export type Session = Auth["$Infer"]["Session"];
export type SessionUser = Session["user"];
