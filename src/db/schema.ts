import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
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

/** SkillForge expertise packages — instructional handoffs, never execution grants. */
export const skillforgePackages = pgTable(
  "skillforge_packages",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 240 }).notNull(),
    brief: text("brief").notNull(),
    categoryKey: varchar("category_key", { length: 60 }).notNull(),
    categoryLabel: varchar("category_label", { length: 120 }).notNull(),
    accepted: boolean("accepted").notNull().default(false),
    previewStatus: varchar("preview_status", { length: 32 }).notNull(),
    graphHash: varchar("graph_hash", { length: 64 }).notNull(),
    catalogVersion: varchar("catalog_version", { length: 80 }).notNull(),
    exportMarkdown: text("export_markdown").notNull(),
    preview: jsonb("preview").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("skillforge_packages_created_at_idx").on(table.createdAt),
    index("skillforge_packages_category_idx").on(table.categoryKey),
  ],
);
