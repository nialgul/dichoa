import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getDb } from "./db";
import { discordUsers, inquiries, serverSettings, webhookSettings } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// Admin procedure - only admins can access
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user?.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

// Helper function to send Discord webhook notifications
async function sendWebhookNotification(webhookUrl: string, data: any) {
  try {
    const embed = {
      title: data.type === 'inquiry_created' ? '새 문의가 접수되었습니다' : '문의가 종료되었습니다',
      description: data.type === 'inquiry_created' ? data.content : `문의 ID: ${data.inquiryId}`,
      fields: [
        ...(data.type === 'inquiry_created' ? [
          { name: '제목', value: data.title, inline: false },
          { name: '이메일', value: data.email, inline: false },
        ] : [
          { name: '제목', value: data.title, inline: false },
        ]),
      ],
      color: data.type === 'inquiry_created' ? 3447003 : 9807270, // Blue for created, Green for closed
      timestamp: new Date().toISOString(),
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    });
  } catch (error) {
    console.error('Failed to send webhook notification:', error);
  }
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Discord OAuth routers
  discord: router({
    // Get user's Discord servers (requires Discord OAuth)
    getServers: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });

      const discordUser = await db.select().from(discordUsers).where(eq(discordUsers.userId, ctx.user!.id)).limit(1);
      if (!discordUser.length) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Discord account not linked' });
      }

      // TODO: Fetch servers from Discord API using accessToken
      // For now, return empty array
      return [];
    }),
  }),

  // Server settings routers
  serverSettings: router({
    get: protectedProcedure
      .input(z.object({ serverId: z.string() }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

        const settings = await db.select().from(serverSettings)
          .where(eq(serverSettings.serverId, input.serverId)).limit(1);

        return settings[0] || null;
      }),

    update: adminProcedure
      .input(z.object({
        serverId: z.string(),
        serverName: z.string().optional(),
        webhookUrl: z.string().optional(),
        inquiryChannelId: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

        const existing = await db.select().from(serverSettings)
          .where(eq(serverSettings.serverId, input.serverId)).limit(1);

        if (existing.length) {
          await db.update(serverSettings)
            .set({
              serverName: input.serverName,
              webhookUrl: input.webhookUrl,
              inquiryChannelId: input.inquiryChannelId,
              updatedAt: new Date(),
            })
            .where(eq(serverSettings.serverId, input.serverId));
        } else {
          await db.insert(serverSettings).values({
            serverId: input.serverId,
            serverName: input.serverName,
            webhookUrl: input.webhookUrl,
            inquiryChannelId: input.inquiryChannelId,
            isActive: true,
          });
        }

        return { success: true };
      }),
  }),

  // Inquiry routers
  inquiries: router({
    create: publicProcedure
      .input(z.object({
        serverId: z.string(),
        title: z.string().min(1),
        content: z.string().min(1),
        email: z.string().email(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

        const result = await db.insert(inquiries).values({
          serverId: input.serverId,
          userId: ctx.user?.id,
          title: input.title,
          content: input.content,
          email: input.email,
          status: 'open',
        });

        // Send webhook notification
        const settings = await db.select().from(webhookSettings)
          .where(eq(webhookSettings.serverId, input.serverId)).limit(1);

        if (settings.length && settings[0].webhookUrl && settings[0].notifyOnInquiry) {
          await sendWebhookNotification(settings[0].webhookUrl, {
            title: input.title,
            content: input.content,
            email: input.email,
            type: 'inquiry_created',
          });
        }

        return { success: true };
      }),

    list: adminProcedure
      .input(z.object({
        serverId: z.string(),
        status: z.enum(['open', 'closed']).optional(),
      }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

        const result = await db.select().from(inquiries)
          .where(eq(inquiries.serverId, input.serverId));

        if (input.status) {
          return result.filter(item => item.status === input.status);
        }

        return result;
      }),

    get: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

        const result = await db.select().from(inquiries)
          .where(eq(inquiries.id, input.id)).limit(1);

        return result[0] || null;
      }),

    close: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

        const inquiry = await db.select().from(inquiries)
          .where(eq(inquiries.id, input.id)).limit(1);

        if (!inquiry.length) {
          throw new TRPCError({ code: 'NOT_FOUND' });
        }

        await db.update(inquiries)
          .set({
            status: 'closed',
            closedAt: new Date(),
            closedBy: ctx.user!.id,
            updatedAt: new Date(),
          })
          .where(eq(inquiries.id, input.id));

        // Send webhook notification
        const settings = await db.select().from(webhookSettings)
          .where(eq(webhookSettings.serverId, inquiry[0].serverId)).limit(1);

        if (settings.length && settings[0].webhookUrl && settings[0].notifyOnClose) {
          await sendWebhookNotification(settings[0].webhookUrl, {
            inquiryId: inquiry[0].id,
            title: inquiry[0].title,
            type: 'inquiry_closed',
          });
        }

        return { success: true };
      }),
  }),

  // Webhook settings routers
  webhookSettings: router({
    get: adminProcedure
      .input(z.object({ serverId: z.string() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

        const settings = await db.select().from(webhookSettings)
          .where(eq(webhookSettings.serverId, input.serverId)).limit(1);

        return settings[0] || null;
      }),

    update: adminProcedure
      .input(z.object({
        serverId: z.string(),
        webhookUrl: z.string().url(),
        notifyOnInquiry: z.boolean().optional(),
        notifyOnClose: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

        const existing = await db.select().from(webhookSettings)
          .where(eq(webhookSettings.serverId, input.serverId)).limit(1);

        if (existing.length) {
          await db.update(webhookSettings)
            .set({
              webhookUrl: input.webhookUrl,
              notifyOnInquiry: input.notifyOnInquiry ?? existing[0].notifyOnInquiry,
              notifyOnClose: input.notifyOnClose ?? existing[0].notifyOnClose,
              updatedAt: new Date(),
            })
            .where(eq(webhookSettings.serverId, input.serverId));
        } else {
          await db.insert(webhookSettings).values({
            serverId: input.serverId,
            webhookUrl: input.webhookUrl,
            notifyOnInquiry: input.notifyOnInquiry ?? true,
            notifyOnClose: input.notifyOnClose ?? true,
          });
        }

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
