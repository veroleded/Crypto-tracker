import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const User = pgTable("user", {
  id: uuid().notNull().primaryKey(), // This will match Supabase Auth user id
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  image: varchar("image", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const Favorite = pgTable("favorite", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  coinId: varchar("coin_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const FavoriteRelations = relations(Favorite, ({ one }) => ({
  user: one(User, { fields: [Favorite.userId], references: [User.id] }),
}));

export const UserRelations = relations(User, ({ many }) => ({
  favorites: many(Favorite),
}));