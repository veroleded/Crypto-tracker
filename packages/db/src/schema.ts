import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const Favorite = pgTable("favorite", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  userId: uuid("user_id").notNull(),
  coinId: varchar("coin_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
