import { boolean } from "drizzle-orm/gel-core";
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
    index("cards_user_created_idx").on(
      table.user_id,
      table.created_at,
      table.id,
    ),
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

export const notifications = pgTable(
  "notifications",
  {
    id: serial("id").primaryKey(),

    user_id: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    from_user_id: integer("from_user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),

    type: text("type").notNull(),

    card_id: integer("card_id").references(() => cards.id, {
      onDelete: "cascade",
    }),

    comment_id: integer("comment_id").references(() => comments.id, {
      onDelete: "cascade",
    }),

    is_read: integer("is_read").default(0).notNull(),

    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("notifications_user_idx").on(table.user_id),

    index("notifications_user_created_idx").on(table.user_id, table.created_at),
  ],
);

export const chats = pgTable(
  "chats",
  {
    id: serial("id").primaryKey(),

    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    last_message: text("last_message"),

    last_message_id: integer("last_message_id"),

    last_message_at: timestamp("last_message_at", { withTimezone: true }),
  },
  (table) => [index("chats_last_message_idx").on(table.last_message_at)],
);

export const chatUsers = pgTable(
  "chat_users",
  {
    chat_id: integer("chat_id")
      .references(() => chats.id, { onDelete: "cascade" })
      .notNull(),

    user_id: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    unread_count: integer("unread_count").default(0).notNull(),
    last_read_at: timestamp("last_read_at", { withTimezone: true }),
  },
  (table) => [
    primaryKey({ columns: [table.chat_id, table.user_id] }),
    index("chat_users_user_idx").on(table.user_id),
    index("chat_users_chat_idx").on(table.chat_id),
  ],
);

export const messages = pgTable(
  "messages",
  {
    id: serial("id").primaryKey(),

    chat_id: integer("chat_id")
      .references(() => chats.id, { onDelete: "cascade" })
      .notNull(),

    sender_id: integer("sender_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),

    content: text("content").notNull(),

    read_at: timestamp("read_at", { withTimezone: true }),

    created_at: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("messages_chat_created_idx").on(
      table.chat_id,
      table.created_at.desc(),
    ),

    index("messages_unread_idx").on(
      table.chat_id,
      table.read_at,
      table.created_at,
    ),
    index("messages_sender_idx").on(table.sender_id),
  ],
);
