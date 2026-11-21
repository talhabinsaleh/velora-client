import { MongoClient } from "mongodb";

// The client connects on first use, so a missing URI does not break `next build`
const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";

const globalForMongo = globalThis as typeof globalThis & { _veloraMongo?: MongoClient };

export const client = globalForMongo._veloraMongo ?? new MongoClient(uri);
if (process.env.NODE_ENV !== "production") globalForMongo._veloraMongo = client;

export const db = client.db(process.env.DB_NAME || "velora");
