import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

export const issueFeedback = sqliteTable(
  'issue_feedback',
  {
    gameSlug: text('game_slug').notNull(),
    topic: text('topic').notNull(),
    strugglingCount: integer('struggling_count').notNull().default(0),
    resolvedCount: integer('resolved_count').notNull().default(0),
    updatedAt: text('updated_at').notNull().default(''),
  },
  (table) => [primaryKey({ columns: [table.gameSlug, table.topic] })],
);

export const solutionMethodFeedback = sqliteTable(
  'solution_method_feedback',
  {
    contextSlug: text('context_slug').notNull(),
    topic: text('topic').notNull(),
    methodId: text('method_id').notNull(),
    methodLabel: text('method_label').notNull(),
    responseCount: integer('response_count').notNull().default(0),
    updatedAt: text('updated_at').notNull().default(''),
  },
  (table) => [
    primaryKey({ columns: [table.contextSlug, table.topic, table.methodId] }),
  ],
);

export const contactSubmissions = sqliteTable('contact_submissions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  category: text('category').notNull(),
  pageUrl: text('page_url').notNull().default(''),
  message: text('message').notNull(),
  replyEmail: text('reply_email').notNull().default(''),
  status: text('status').notNull().default('new'),
  createdAt: text('created_at').notNull(),
});
