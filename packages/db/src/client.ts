import { createPool } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const pool = createPool({
  connectionString:
    process.env.DATABASE_URL + "?workaround=supabase-pooler.vercel",
  ssl: { rejectUnauthorized: false },
  max: 1,
});

export const db = drizzle(pool, {
  schema,
  casing: "snake_case",
});
