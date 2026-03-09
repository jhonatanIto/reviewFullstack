import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  unique_id: text("unique_id").notNull().unique(),
  password: text("password"),
  googleId: text("google_id"),
  picture: text("picture"),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  poster: text("poster").notNull(),
  banner: text("banner"),
  release: text("release").notNull(),
  description: text("description").notNull(),
  review: text("review"),
  rate: integer("rate").notNull(),
  tmdb_id: integer("tmdb_id").notNull(),
  user_id: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const watchlist = pgTable("watchlist", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  poster: text("poster").notNull(),
  banner: text("banner"),
  release: text("release").notNull(),
  description: text("description").notNull(),
  tmdb_id: integer("tmdb_id").notNull(),
  user_id: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const follows = pgTable(
  "follows",
  {
    follower_id: integer("follower_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    following_id: integer("following_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.follower_id, table.following_id] }),
    index("follower_idx").on(table.follower_id),
    index("following_idx").on(table.following_id),
  ],
);
