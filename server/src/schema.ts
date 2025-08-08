import { z } from 'zod';

// Enums
export const userRoleEnum = z.enum(['USER', 'ADMIN']);
export const nicheEnum = z.enum(['CULINARY']);
export const mediaTypeEnum = z.enum(['IMAGE', 'VIDEO']);
export const contentStatusEnum = z.enum(['DRAFT', 'SCHEDULED', 'POSTED', 'FAILED']);
export const platformEnum = z.enum(['FACEBOOK', 'INSTAGRAM', 'TIKTOK']);
export const subscriptionPlanEnum = z.enum(['FREE', 'PREMIUM']);
export const subscriptionStatusEnum = z.enum(['ACTIVE', 'INACTIVE']);

// User schema
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  password_hash: z.string(),
  role: userRoleEnum,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Input schemas for user operations
export const createUserInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: userRoleEnum.default('USER')
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export type LoginInput = z.infer<typeof loginInputSchema>;

// Business Profile schema
export const businessProfileSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  business_name: z.string(),
  niche: nicheEnum,
  timezone: z.string().default('Asia/Jakarta')
});

export type BusinessProfile = z.infer<typeof businessProfileSchema>;

export const createBusinessProfileInputSchema = z.object({
  user_id: z.string().uuid(),
  business_name: z.string().min(1),
  niche: nicheEnum,
  timezone: z.string().default('Asia/Jakarta')
});

export type CreateBusinessProfileInput = z.infer<typeof createBusinessProfileInputSchema>;

// Content Package schema
export const contentPackageSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  title: z.string(),
  month: z.number().int().min(1).max(12),
  year: z.number().int(),
  niche: nicheEnum,
  is_premium: z.boolean(),
  created_by: z.string().uuid(),
  created_at: z.coerce.date()
});

export type ContentPackage = z.infer<typeof contentPackageSchema>;

export const createContentPackageInputSchema = z.object({
  code: z.string().min(1),
  title: z.string().min(1),
  month: z.number().int().min(1).max(12),
  year: z.number().int(),
  niche: nicheEnum,
  is_premium: z.boolean(),
  created_by: z.string().uuid()
});

export type CreateContentPackageInput = z.infer<typeof createContentPackageInputSchema>;

export const updateContentPackageInputSchema = z.object({
  id: z.string().uuid(),
  code: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  month: z.number().int().min(1).max(12).optional(),
  year: z.number().int().optional(),
  niche: nicheEnum.optional(),
  is_premium: z.boolean().optional()
});

export type UpdateContentPackageInput = z.infer<typeof updateContentPackageInputSchema>;

// Template schema
export const editableLayerSchema = z.object({
  type: z.enum(['text', 'image']),
  id: z.string(),
  content: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number()
  }).optional()
});

export const templateSchema = z.object({
  id: z.string().uuid(),
  package_id: z.string().uuid(),
  day_index: z.number().int().min(1).max(31),
  title: z.string(),
  caption_suggest: z.string(),
  hashtags: z.string(),
  thumb_url: z.string(),
  editable_layers: z.array(editableLayerSchema)
});

export type Template = z.infer<typeof templateSchema>;

export const createTemplateInputSchema = z.object({
  package_id: z.string().uuid(),
  day_index: z.number().int().min(1).max(31),
  title: z.string().min(1),
  caption_suggest: z.string(),
  hashtags: z.string(),
  thumb_url: z.string().url(),
  editable_layers: z.array(editableLayerSchema)
});

export type CreateTemplateInput = z.infer<typeof createTemplateInputSchema>;

export const updateTemplateInputSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).optional(),
  caption_suggest: z.string().optional(),
  hashtags: z.string().optional(),
  thumb_url: z.string().url().optional(),
  editable_layers: z.array(editableLayerSchema).optional()
});

export type UpdateTemplateInput = z.infer<typeof updateTemplateInputSchema>;

// Media Asset schema
export const mediaAssetSchema = z.object({
  id: z.string().uuid(),
  url: z.string().url(),
  type: mediaTypeEnum,
  width: z.number().int(),
  height: z.number().int(),
  size_bytes: z.number().int(),
  uploaded_by: z.string().uuid(),
  created_at: z.coerce.date()
});

export type MediaAsset = z.infer<typeof mediaAssetSchema>;

export const createMediaAssetInputSchema = z.object({
  url: z.string().url(),
  type: mediaTypeEnum,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  size_bytes: z.number().int().positive(),
  uploaded_by: z.string().uuid()
});

export type CreateMediaAssetInput = z.infer<typeof createMediaAssetInputSchema>;

// User Content schema
export const userContentSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  template_id: z.string().uuid(),
  title: z.string(),
  caption: z.string(),
  image_url: z.string(),
  status: contentStatusEnum,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type UserContent = z.infer<typeof userContentSchema>;

export const createUserContentInputSchema = z.object({
  user_id: z.string().uuid(),
  template_id: z.string().uuid(),
  title: z.string().min(1),
  caption: z.string(),
  image_url: z.string().url(),
  status: contentStatusEnum.default('DRAFT')
});

export type CreateUserContentInput = z.infer<typeof createUserContentInputSchema>;

export const updateUserContentInputSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).optional(),
  caption: z.string().optional(),
  image_url: z.string().url().optional(),
  status: contentStatusEnum.optional()
});

export type UpdateUserContentInput = z.infer<typeof updateUserContentInputSchema>;

// Post Schedule schema
export const postScheduleSchema = z.object({
  id: z.string().uuid(),
  user_content_id: z.string().uuid(),
  platform: platformEnum,
  scheduled_at: z.coerce.date(),
  post_time_local: z.string(),
  result_message: z.string().nullable()
});

export type PostSchedule = z.infer<typeof postScheduleSchema>;

export const createPostScheduleInputSchema = z.object({
  user_content_id: z.string().uuid(),
  platform: platformEnum,
  scheduled_at: z.coerce.date(),
  post_time_local: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/) // HH:MM format
});

export type CreatePostScheduleInput = z.infer<typeof createPostScheduleInputSchema>;

// Social Account schema
export const socialAccountSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  platform: platformEnum,
  account_name: z.string(),
  connected: z.boolean()
});

export type SocialAccount = z.infer<typeof socialAccountSchema>;

export const createSocialAccountInputSchema = z.object({
  user_id: z.string().uuid(),
  platform: platformEnum,
  account_name: z.string().min(1),
  connected: z.boolean().default(false)
});

export type CreateSocialAccountInput = z.infer<typeof createSocialAccountInputSchema>;

// Subscription schema
export const subscriptionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  plan: subscriptionPlanEnum,
  status: subscriptionStatusEnum,
  started_at: z.coerce.date(),
  expires_at: z.coerce.date()
});

export type Subscription = z.infer<typeof subscriptionSchema>;

export const createSubscriptionInputSchema = z.object({
  user_id: z.string().uuid(),
  plan: subscriptionPlanEnum,
  status: subscriptionStatusEnum.default('ACTIVE'),
  started_at: z.coerce.date(),
  expires_at: z.coerce.date()
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionInputSchema>;

// Engagement Metrics schema
export const engagementMetricsSchema = z.object({
  id: z.string().uuid(),
  user_content_id: z.string().uuid(),
  platform: platformEnum,
  likes: z.number().int().nonnegative(),
  comments: z.number().int().nonnegative(),
  shares: z.number().int().nonnegative(),
  fetched_at: z.coerce.date()
});

export type EngagementMetrics = z.infer<typeof engagementMetricsSchema>;

export const createEngagementMetricsInputSchema = z.object({
  user_content_id: z.string().uuid(),
  platform: platformEnum,
  likes: z.number().int().nonnegative(),
  comments: z.number().int().nonnegative(),
  shares: z.number().int().nonnegative()
});

export type CreateEngagementMetricsInput = z.infer<typeof createEngagementMetricsInputSchema>;

// Mock AI Caption Generator schema
export const aiCaptionRequestSchema = z.object({
  prompt: z.string().min(1),
  business_context: z.string().optional()
});

export type AiCaptionRequest = z.infer<typeof aiCaptionRequestSchema>;

export const aiCaptionResponseSchema = z.object({
  alternatives: z.array(z.string()),
  hashtags: z.array(z.string())
});

export type AiCaptionResponse = z.infer<typeof aiCaptionResponseSchema>;