import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __sitePrisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var __sitePrismaPool: Pool | undefined;
}

// node-postgres (`pg`) talks to CockroachDB over Workers' TCP socket
// support (requires the `nodejs_compat` compatibility flag — see
// wrangler.jsonc). A small max pool size matters here: each Worker
// invocation can spin up its own isolate, and CockroachDB (like most
// managed Postgres-compatible databases) caps total concurrent
// connections — opening one unbounded pool per isolate is how that cap
// gets exhausted under real traffic. If that starts happening, put
// Cloudflare Hyperdrive in front of this instead of raising the pool
// size — see the migration notes for details.
function getPool(): Pool {
  if (!global.__sitePrismaPool) {
    global.__sitePrismaPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
    });
  }
  return global.__sitePrismaPool;
}

function createClient(): PrismaClient {
  const adapter = new PrismaPg(getPool());
  return new PrismaClient({ adapter });
}

export const prisma = global.__sitePrisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  global.__sitePrisma = prisma;
}
