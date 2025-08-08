import { pgTable, uuid, text, timestamp, integer, boolean, jsonb, pgEnum, unique } from 'drizzle-orm/pg-core';

// Define enums
export const userRoleEnum = pgEnum('user_role', ['USER', 'ADMIN']);
export const nicheEnum = pgEnum('niche', ['CULINARY']);
export const mediaTypeEnum = pgEnum('media_type', ['IMAGE', 'VIDEO']);
export const contentStatusEnum = pgEnum('content_status', ['DRAFT', 'SCHEDULED', 'POSTED', 'FAILED']);
export const platformEnum = pgEnum('platform', ['FACEBOOK', 'INSTAGRAM', 'TIKTOK']);
export const subscriptionPlanEnum = pgEnum('subscription_plan', ['FREE', 'PREMIUM']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['ACTIVE', 'INACTIVE']);

// Users table
export const usersTable = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').unique().notNull(),
  password_hash: text('password_hash').notNull(),
  role: userRoleEnum('role').default('USER').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Business profiles table
export const businessProfilesTable = pgTable('business_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').references(() => usersTable.id).notNull(),
  business_name: text('business_name').notNull(),
  niche: nicheEnum('niche').notNull(),
  timezone: text('timezone').default('Asia/Jakarta').notNull()
});

// Content packages table
export const contentPackagesTable = pgTable('content_packages', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').unique().notNull(),
  title: text('title').notNull(),
  month: integer('month').notNull(),
  year: integer('year').notNull(),
  niche: nicheEnum('niche').notNull(),
  is_premium: boolean('is_premium').default(false).notNull(),
  created_by: uuid('created_by').references(() => usersTable.id).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Templates table
export const templatesTable = pgTable('templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  package_id: uuid('package_id').references(() => contentPackagesTable.id).notNull(),
  day_index: integer('day_index').notNull(),
  title: text('title').notNull(),
  caption_suggest: text('caption_suggest').notNull(),
  hashtags: text('hashtags').notNull(),
  thumb_url: text('thumb_url').notNull(),
  editable_layers: jsonb('editable_layers').notNull()
}, (table) => ({
  uniquePackageDayIndex: unique().on(table.package_id, table.day_index)
}));

// Media assets table
export const mediaAssetsTable = pgTable('media_assets', {
  id: uuid('id').defaultRandom().primaryKey(),
  url: text('url').notNull(),
  type: mediaTypeEnum('type').notNull(),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  size_bytes: integer('size_bytes').notNull(),
  uploaded_by: uuid('uploaded_by').references(() => usersTable.id).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// User contents table
export const userContentsTable = pgTable('user_contents', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').references(() => usersTable.id).notNull(),
  template_id: uuid('template_id').references(() => templatesTable.id).notNull(),
  title: text('title').notNull(),
  caption: text('caption').notNull(),
  image_url: text('image_url').notNull(),
  status: contentStatusEnum('status').default('DRAFT').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Post schedules table
export const postSchedulesTable = pgTable('post_schedules', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_content_id: uuid('user_content_id').references(() => userContentsTable.id).notNull(),
  platform: platformEnum('platform').notNull(),
  scheduled_at: timestamp('scheduled_at', { withTimezone: true }).notNull(),
  post_time_local: text('post_time_local').notNull(),
  result_message: text('result_message')
});

// Social accounts table
export const socialAccountsTable = pgTable('social_accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').references(() => usersTable.id).notNull(),
  platform: platformEnum('platform').notNull(),
  account_name: text('account_name').notNull(),
  connected: boolean('connected').default(false).notNull()
});

// Subscriptions table
export const subscriptionsTable = pgTable('subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').references(() => usersTable.id).notNull(),
  plan: subscriptionPlanEnum('plan').notNull(),
  status: subscriptionStatusEnum('status').default('ACTIVE').notNull(),
  started_at: timestamp('started_at').notNull(),
  expires_at: timestamp('expires_at').notNull()
});

// Engagement metrics table
export const engagementMetricsTable = pgTable('engagement_metrics', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_content_id: uuid('user_content_id').references(() => userContentsTable.id).notNull(),
  platform: platformEnum('platform').notNull(),
  likes: integer('likes').default(0).notNull(),
  comments: integer('comments').default(0).notNull(),
  shares: integer('shares').default(0).notNull(),
  fetched_at: timestamp('fetched_at').defaultNow().notNull()
});

// Export all tables for relation queries
export const tables = {
  users: usersTable,
  businessProfiles: businessProfilesTable,
  contentPackages: contentPackagesTable,
  templates: templatesTable,
  mediaAssets: mediaAssetsTable,
  userContents: userContentsTable,
  postSchedules: postSchedulesTable,
  socialAccounts: socialAccountsTable,
  subscriptions: subscriptionsTable,
  engagementMetrics: engagementMetricsTable
};

// TypeScript types for the table schemas
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export type BusinessProfile = typeof businessProfilesTable.$inferSelect;
export type NewBusinessProfile = typeof businessProfilesTable.$inferInsert;

export type ContentPackage = typeof contentPackagesTable.$inferSelect;
export type NewContentPackage = typeof contentPackagesTable.$inferInsert;

export type Template = typeof templatesTable.$inferSelect;
export type NewTemplate = typeof templatesTable.$inferInsert;

export type MediaAsset = typeof mediaAssetsTable.$inferSelect;
export type NewMediaAsset = typeof mediaAssetsTable.$inferInsert;

export type UserContent = typeof userContentsTable.$inferSelect;
export type NewUserContent = typeof userContentsTable.$inferInsert;

export type PostSchedule = typeof postSchedulesTable.$inferSelect;
export type NewPostSchedule = typeof postSchedulesTable.$inferInsert;

export type SocialAccount = typeof socialAccountsTable.$inferSelect;
export type NewSocialAccount = typeof socialAccountsTable.$inferInsert;

export type Subscription = typeof subscriptionsTable.$inferSelect;
export type NewSubscription = typeof subscriptionsTable.$inferInsert;

export type EngagementMetrics = typeof engagementMetricsTable.$inferSelect;
export type NewEngagementMetrics = typeof engagementMetricsTable.$inferInsert;