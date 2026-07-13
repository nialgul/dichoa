import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Discord 사용자 정보 테이블
 * Manus 사용자와 Discord 계정을 연결
 */
export const discordUsers = mysqlTable("discord_users", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  discordId: varchar("discord_id", { length: 64 }).notNull().unique(),
  discordUsername: varchar("discord_username", { length: 255 }),
  discordAvatar: text("discord_avatar"),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  tokenExpiresAt: timestamp("token_expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type DiscordUser = typeof discordUsers.$inferSelect;
export type InsertDiscordUser = typeof discordUsers.$inferInsert;

/**
 * 서버 설정 테이블
 * 각 Discord 서버별 봇 설정 저장
 */
export const serverSettings = mysqlTable("server_settings", {
  id: int("id").autoincrement().primaryKey(),
  serverId: varchar("server_id", { length: 64 }).notNull().unique(),
  serverName: varchar("server_name", { length: 255 }),
  serverIcon: text("server_icon"),
  webhookUrl: text("webhook_url"),
  inquiryChannelId: varchar("inquiry_channel_id", { length: 64 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ServerSettings = typeof serverSettings.$inferSelect;
export type InsertServerSettings = typeof serverSettings.$inferInsert;

/**
 * 문의 테이블
 * 사용자가 제출한 웹 문의 저장
 */
export const inquiries = mysqlTable("inquiries", {
  id: int("id").autoincrement().primaryKey(),
  serverId: varchar("server_id", { length: 64 }).notNull(),
  userId: int("user_id"),
  discordUserId: varchar("discord_user_id", { length: 64 }),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  email: varchar("email", { length: 320 }),
  status: mysqlEnum("status", ["open", "closed"]).default("open").notNull(),
  closedAt: timestamp("closed_at"),
  closedBy: int("closed_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;

/**
 * 웹훅 설정 테이블
 * Discord 웹훅 알림 설정
 */
export const webhookSettings = mysqlTable("webhook_settings", {
  id: int("id").autoincrement().primaryKey(),
  serverId: varchar("server_id", { length: 64 }).notNull().unique(),
  webhookUrl: text("webhook_url").notNull(),
  notifyOnInquiry: boolean("notify_on_inquiry").default(true).notNull(),
  notifyOnClose: boolean("notify_on_close").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type WebhookSettings = typeof webhookSettings.$inferSelect;
export type InsertWebhookSettings = typeof webhookSettings.$inferInsert;