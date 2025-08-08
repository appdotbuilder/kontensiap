import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import all schemas
import {
  createUserInputSchema,
  loginInputSchema,
  createBusinessProfileInputSchema,
  createContentPackageInputSchema,
  updateContentPackageInputSchema,
  createTemplateInputSchema,
  updateTemplateInputSchema,
  createUserContentInputSchema,
  updateUserContentInputSchema,
  createPostScheduleInputSchema,
  createSocialAccountInputSchema,
  createSubscriptionInputSchema,
  createMediaAssetInputSchema,
  createEngagementMetricsInputSchema,
  aiCaptionRequestSchema
} from './schema';

// Import all handlers
import { registerUser, loginUser, getUserById } from './handlers/auth';
import { createBusinessProfile, getBusinessProfileByUserId, updateBusinessProfile } from './handlers/business_profile';
import { createContentPackage, getContentPackages, getContentPackageById, updateContentPackage, deleteContentPackage } from './handlers/content_packages';
import { createTemplate, getTemplatesByPackageId, getTemplateById, getAccessibleTemplates, updateTemplate, deleteTemplate } from './handlers/templates';
import { createUserContent, getUserContentsByUserId, getUserContentById, updateUserContent, deleteUserContent, getUserContentsByStatus } from './handlers/user_content';
import { createPostSchedule, getPostSchedulesByUserId, getUpcomingSchedules, updateScheduleResult, deletePostSchedule, mockExecuteScheduledPost } from './handlers/post_schedules';
import { createSocialAccount, getSocialAccountsByUserId, updateSocialAccountConnection, deleteSocialAccount, mockConnectSocialAccount } from './handlers/social_accounts';
import { createSubscription, getSubscriptionByUserId, updateSubscriptionStatus, upgradeSubscription, checkSubscriptionAccess } from './handlers/subscriptions';
import { createMediaAsset, getMediaAssetsByUserId, getMediaAssetById, deleteMediaAsset, mockUploadImage } from './handlers/media_assets';
import { createEngagementMetrics, getEngagementMetricsByContentId, mockFetchEngagementMetrics, updateEngagementMetrics } from './handlers/engagement_metrics';
import { generateAiCaptions, generateHashtagsForNiche, mockAiContentSuggestions } from './handlers/ai_caption';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Authentication routes
  auth: router({
    register: publicProcedure
      .input(createUserInputSchema)
      .mutation(({ input }) => registerUser(input)),
    
    login: publicProcedure
      .input(loginInputSchema)
      .mutation(({ input }) => loginUser(input)),
    
    getUser: publicProcedure
      .input(createUserInputSchema.pick({ email: true }))
      .query(({ input }) => getUserById(input.email)) // Note: This should use actual user ID
  }),

  // Business Profile routes
  businessProfile: router({
    create: publicProcedure
      .input(createBusinessProfileInputSchema)
      .mutation(({ input }) => createBusinessProfile(input)),
    
    getByUserId: publicProcedure
      .input(createBusinessProfileInputSchema.pick({ user_id: true }))
      .query(({ input }) => getBusinessProfileByUserId(input.user_id)),
    
    update: publicProcedure
      .input(createBusinessProfileInputSchema.pick({ user_id: true }).extend({
        business_name: createBusinessProfileInputSchema.shape.business_name.optional(),
        niche: createBusinessProfileInputSchema.shape.niche.optional(),
        timezone: createBusinessProfileInputSchema.shape.timezone.optional()
      }))
      .mutation(({ input }) => updateBusinessProfile(input.user_id, input))
  }),

  // Content Package routes
  contentPackages: router({
    create: publicProcedure
      .input(createContentPackageInputSchema)
      .mutation(({ input }) => createContentPackage(input)),
    
    getAll: publicProcedure
      .query(() => getContentPackages()),
    
    getById: publicProcedure
      .input(createContentPackageInputSchema.pick({ code: true })) // Using code as identifier
      .query(({ input }) => getContentPackageById(input.code)),
    
    update: publicProcedure
      .input(updateContentPackageInputSchema)
      .mutation(({ input }) => updateContentPackage(input)),
    
    delete: publicProcedure
      .input(updateContentPackageInputSchema.pick({ id: true }))
      .mutation(({ input }) => deleteContentPackage(input.id))
  }),

  // Template routes
  templates: router({
    create: publicProcedure
      .input(createTemplateInputSchema)
      .mutation(({ input }) => createTemplate(input)),
    
    getByPackageId: publicProcedure
      .input(createTemplateInputSchema.pick({ package_id: true }))
      .query(({ input }) => getTemplatesByPackageId(input.package_id)),
    
    getById: publicProcedure
      .input(updateTemplateInputSchema.pick({ id: true }))
      .query(({ input }) => getTemplateById(input.id)),
    
    getAccessible: publicProcedure
      .input(createTemplateInputSchema.pick({ package_id: true }).extend({
        userPlan: createSubscriptionInputSchema.shape.plan
      }))
      .query(({ input }) => getAccessibleTemplates(input.package_id, input.userPlan)),
    
    update: publicProcedure
      .input(updateTemplateInputSchema)
      .mutation(({ input }) => updateTemplate(input)),
    
    delete: publicProcedure
      .input(updateTemplateInputSchema.pick({ id: true }))
      .mutation(({ input }) => deleteTemplate(input.id))
  }),

  // User Content routes
  userContent: router({
    create: publicProcedure
      .input(createUserContentInputSchema)
      .mutation(({ input }) => createUserContent(input)),
    
    getByUserId: publicProcedure
      .input(createUserContentInputSchema.pick({ user_id: true }))
      .query(({ input }) => getUserContentsByUserId(input.user_id)),
    
    getById: publicProcedure
      .input(updateUserContentInputSchema.pick({ id: true }))
      .query(({ input }) => getUserContentById(input.id)),
    
    update: publicProcedure
      .input(updateUserContentInputSchema)
      .mutation(({ input }) => updateUserContent(input)),
    
    delete: publicProcedure
      .input(updateUserContentInputSchema.pick({ id: true }))
      .mutation(({ input }) => deleteUserContent(input.id)),
    
    getByStatus: publicProcedure
      .input(createUserContentInputSchema.pick({ user_id: true }).extend({
        status: createUserContentInputSchema.shape.status
      }))
      .query(({ input }) => getUserContentsByStatus(input.user_id, input.status))
  }),

  // Post Schedule routes
  postSchedules: router({
    create: publicProcedure
      .input(createPostScheduleInputSchema)
      .mutation(({ input }) => createPostSchedule(input)),
    
    getByUserId: publicProcedure
      .input(createPostScheduleInputSchema.pick({ user_content_id: true }).extend({
        user_id: createUserContentInputSchema.shape.user_id
      }))
      .query(({ input }) => getPostSchedulesByUserId(input.user_id)),
    
    getUpcoming: publicProcedure
      .input(createPostScheduleInputSchema.pick({ user_content_id: true }).extend({
        user_id: createUserContentInputSchema.shape.user_id
      }))
      .query(({ input }) => getUpcomingSchedules(input.user_id)),
    
    updateResult: publicProcedure
      .input(createPostScheduleInputSchema.pick({ user_content_id: true }).extend({
        schedule_id: createPostScheduleInputSchema.shape.user_content_id,
        result_message: createPostScheduleInputSchema.shape.post_time_local, // reusing string type
        success: createSocialAccountInputSchema.shape.connected // reusing boolean type
      }))
      .mutation(({ input }) => updateScheduleResult(input.schedule_id, input.result_message, input.success)),
    
    delete: publicProcedure
      .input(createPostScheduleInputSchema.pick({ user_content_id: true }).extend({
        schedule_id: createPostScheduleInputSchema.shape.user_content_id
      }))
      .mutation(({ input }) => deletePostSchedule(input.schedule_id)),
    
    mockExecute: publicProcedure
      .input(createPostScheduleInputSchema.pick({ user_content_id: true }).extend({
        schedule_id: createPostScheduleInputSchema.shape.user_content_id
      }))
      .mutation(({ input }) => mockExecuteScheduledPost(input.schedule_id))
  }),

  // Social Account routes
  socialAccounts: router({
    create: publicProcedure
      .input(createSocialAccountInputSchema)
      .mutation(({ input }) => createSocialAccount(input)),
    
    getByUserId: publicProcedure
      .input(createSocialAccountInputSchema.pick({ user_id: true }))
      .query(({ input }) => getSocialAccountsByUserId(input.user_id)),
    
    updateConnection: publicProcedure
      .input(createSocialAccountInputSchema.pick({ user_id: true, connected: true }).extend({
        account_id: createSocialAccountInputSchema.shape.user_id
      }))
      .mutation(({ input }) => updateSocialAccountConnection(input.account_id, input.connected)),
    
    delete: publicProcedure
      .input(createSocialAccountInputSchema.pick({ user_id: true }).extend({
        account_id: createSocialAccountInputSchema.shape.user_id
      }))
      .mutation(({ input }) => deleteSocialAccount(input.account_id)),
    
    mockConnect: publicProcedure
      .input(createSocialAccountInputSchema.pick({ user_id: true, platform: true }))
      .mutation(({ input }) => mockConnectSocialAccount(input.user_id, input.platform))
  }),

  // Subscription routes
  subscriptions: router({
    create: publicProcedure
      .input(createSubscriptionInputSchema)
      .mutation(({ input }) => createSubscription(input)),
    
    getByUserId: publicProcedure
      .input(createSubscriptionInputSchema.pick({ user_id: true }))
      .query(({ input }) => getSubscriptionByUserId(input.user_id)),
    
    updateStatus: publicProcedure
      .input(createSubscriptionInputSchema.pick({ user_id: true, status: true }).extend({
        subscription_id: createSubscriptionInputSchema.shape.user_id
      }))
      .mutation(({ input }) => updateSubscriptionStatus(input.subscription_id, input.status)),
    
    upgrade: publicProcedure
      .input(createSubscriptionInputSchema.pick({ user_id: true, plan: true }))
      .mutation(({ input }) => upgradeSubscription(input.user_id, input.plan)),
    
    checkAccess: publicProcedure
      .input(createSubscriptionInputSchema.pick({ user_id: true }))
      .query(({ input }) => checkSubscriptionAccess(input.user_id))
  }),

  // Media Asset routes
  mediaAssets: router({
    create: publicProcedure
      .input(createMediaAssetInputSchema)
      .mutation(({ input }) => createMediaAsset(input)),
    
    getByUserId: publicProcedure
      .input(createMediaAssetInputSchema.pick({ uploaded_by: true }))
      .query(({ input }) => getMediaAssetsByUserId(input.uploaded_by)),
    
    getById: publicProcedure
      .input(createMediaAssetInputSchema.pick({ uploaded_by: true }).extend({
        asset_id: createMediaAssetInputSchema.shape.uploaded_by
      }))
      .query(({ input }) => getMediaAssetById(input.asset_id)),
    
    delete: publicProcedure
      .input(createMediaAssetInputSchema.pick({ uploaded_by: true }).extend({
        asset_id: createMediaAssetInputSchema.shape.uploaded_by
      }))
      .mutation(({ input }) => deleteMediaAsset(input.asset_id)),
    
    mockUpload: publicProcedure
      .input(createMediaAssetInputSchema.pick({ uploaded_by: true }).extend({
        file: createMediaAssetInputSchema.pick({ url: true, size_bytes: true, type: true }).extend({
          name: createMediaAssetInputSchema.shape.url
        })
      }))
      .mutation(({ input }) => mockUploadImage({
        name: input.file.name,
        size: input.file.size_bytes,
        type: input.file.type
      }, input.uploaded_by))
  }),

  // Engagement Metrics routes
  engagementMetrics: router({
    create: publicProcedure
      .input(createEngagementMetricsInputSchema)
      .mutation(({ input }) => createEngagementMetrics(input)),
    
    getByContentId: publicProcedure
      .input(createEngagementMetricsInputSchema.pick({ user_content_id: true }))
      .query(({ input }) => getEngagementMetricsByContentId(input.user_content_id)),
    
    mockFetch: publicProcedure
      .input(createEngagementMetricsInputSchema.pick({ user_content_id: true }))
      .mutation(({ input }) => mockFetchEngagementMetrics(input.user_content_id)),
    
    update: publicProcedure
      .input(createEngagementMetricsInputSchema.extend({
        metrics_id: createEngagementMetricsInputSchema.shape.user_content_id
      }))
      .mutation(({ input }) => updateEngagementMetrics(input.metrics_id, {
        likes: input.likes,
        comments: input.comments,
        shares: input.shares
      }))
  }),

  // AI Caption routes
  ai: router({
    generateCaptions: publicProcedure
      .input(aiCaptionRequestSchema)
      .mutation(({ input }) => generateAiCaptions(input)),
    
    generateHashtags: publicProcedure
      .input(aiCaptionRequestSchema.pick({ prompt: true }).extend({
        niche: createBusinessProfileInputSchema.shape.niche,
        business_context: aiCaptionRequestSchema.shape.business_context
      }))
      .query(({ input }) => generateHashtagsForNiche(input.niche, input.business_context)),
    
    mockContentSuggestions: publicProcedure
      .input(aiCaptionRequestSchema.pick({ prompt: true }).extend({
        template_title: aiCaptionRequestSchema.shape.prompt,
        business_name: aiCaptionRequestSchema.shape.prompt
      }))
      .query(({ input }) => mockAiContentSuggestions(input.template_title, input.business_name))
  })
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();