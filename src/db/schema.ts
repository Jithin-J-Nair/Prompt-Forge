import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const prompts = pgTable(
  "prompts",
  {
    id: serial("id").primaryKey(),
    rawPrompt: text("raw_prompt").notNull(),
    title: varchar("title", { length: 240 }).notNull(),
    industry: varchar("industry", { length: 80 }).notNull(),
    industryId: varchar("industry_id", { length: 60 }).notNull(),
    brandName: varchar("brand_name", { length: 120 }).notNull(),
    spec: jsonb("spec").notNull(),
    megaPrompt: text("mega_prompt").notNull(),
    wordCount: integer("word_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("prompts_created_at_idx").on(table.createdAt),
    index("prompts_industry_idx").on(table.industryId),
  ],
);

/**
 * Studio compositions — saved module selections from the Visual Prompt
 * Engineering Studio. Non-destructive addition alongside `prompts`.
 */
export const compositions = pgTable(
  "compositions",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    brief: text("brief").notNull().default(""),
    selections: jsonb("selections").notNull(),
    compiled: text("compiled").notNull(),
    moduleCount: integer("module_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("compositions_created_at_idx").on(table.createdAt)],
);
