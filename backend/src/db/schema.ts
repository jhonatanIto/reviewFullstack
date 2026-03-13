import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  primaryKey,
  index,
  unique,
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

export const cards = pgTable(
  "cards",
  {
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
  },
  (table) => [
    index("cards_user_idx").on(table.user_id),
    index("cards_created_idx").on(table.created_at),
  ],
);

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

export const likes = pgTable(
  "likes",
  {
    id: serial("id").primaryKey(),
    user_id: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    card_id: integer("card_id")
      .references(() => cards.id, { onDelete: "cascade" })
      .notNull(),

    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("likes_user_card_unique").on(table.user_id, table.card_id),
    index("likes_card_idx").on(table.card_id),
  ],
);

export const comments = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    comment: text("comment").notNull(),

    user_id: integer("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),

    card_id: integer("card_id")
      .references(() => cards.id, {
        onDelete: "cascade",
      })
      .notNull(),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("comments_card_idx").on(table.card_id),
    index("comments_user_idx").on(table.user_id),
  ],
);

export const comment_likes = pgTable(
  "comment_likes",
  {
    user_id: integer("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    comment_id: integer("comment_id")
      .references(() => comments.id, {
        onDelete: "cascade",
      })
      .notNull(),
    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.user_id, table.comment_id] }),
    index("comment_likes_comment_idx").on(table.comment_id),
  ],
);
