import { MongoClient } from "mongodb";

// The client connects on first use, so a missing URI does not break `next build`
const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";
const dbName = process.env.DB_NAME || "velora";

interface Connection {
  client: MongoClient;
  closed: boolean;
}

const store = globalThis as typeof globalThis & { _veloraMongoConn?: Connection };

function open(): Connection {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000, maxIdleTimeMS: 60_000 });
  const conn: Connection = { client, closed: false };
  // If the cluster can't be reached the driver tears the topology down for good, so remember it
  client.on("topologyClosed", () => {
    conn.closed = true;
  });
  return conn;
}

// Returns a usable connection, replacing it if the previous one was closed
export function getMongo() {
  if (!store._veloraMongoConn || store._veloraMongoConn.closed) store._veloraMongoConn = open();
  const { client } = store._veloraMongoConn;
  return { client, db: client.db(dbName) };
}

export function markMongoClosed() {
  if (store._veloraMongoConn) store._veloraMongoConn.closed = true;
}

export function isConnectionError(err: unknown) {
  const name = (err as { name?: string })?.name ?? "";
  const message = String((err as { message?: string })?.message ?? err);
  return /MongoTopologyClosedError|MongoServerSelectionError|MongoNetworkError|MongoNotConnectedError/.test(name + " " + message) || /Topology is closed/i.test(message);
}
