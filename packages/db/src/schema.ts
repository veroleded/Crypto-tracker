import { decimal, pgTable, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";

export const Favorite = pgTable("favorite", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  userId: uuid("user_id").notNull(),
  coinId: varchar("coin_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userCoinUnique: unique().on(table.userId, table.coinId),
}));

export const CoinPurchase = pgTable("coin_purchase", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  userId: uuid("user_id").notNull(),
  coinId: varchar("coin_id", { length: 255 }).notNull(),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  purchasePrice: decimal("purchase_price", { precision: 18, scale: 8 }).notNull(),
  purchaseDate: timestamp("purchase_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
