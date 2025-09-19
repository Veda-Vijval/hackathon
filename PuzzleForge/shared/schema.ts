import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Research Reports Schema
export const reports = pgTable("reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  keyTakeaways: json("key_takeaways").$type<string[]>().notNull(),
  insights: text("insights").notNull(),
  fullReport: text("full_report").notNull(),
  citations: json("citations").$type<Citation[]>().notNull(),
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  creditsUsed: integer("credits_used").notNull(),
  userId: varchar("user_id"),
});

// Upload Files Schema
export const uploadedFiles = pgTable("uploaded_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  size: integer("size").notNull(),
  type: text("type").notNull(),
  content: text("content"),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  userId: varchar("user_id"),
});

// Usage Tracking Schema
export const usageStats = pgTable("usage_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  totalQuestions: integer("total_questions").default(0).notNull(),
  totalReports: integer("total_reports").default(0).notNull(),
  totalCreditsUsed: integer("total_credits_used").default(0).notNull(),
  totalCreditsAvailable: integer("total_credits_available").default(100).notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

// Types for Citations
export interface Citation {
  id: string;
  title: string;
  url?: string;
  type: 'document' | 'web' | 'live-data';
  lastUpdated?: string;
}

// Insert schemas
export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  generatedAt: true,
  lastUpdated: true,
});

export const insertFileSchema = createInsertSchema(uploadedFiles).omit({
  id: true,
  uploadedAt: true,
});

export const insertUsageSchema = createInsertSchema(usageStats).omit({
  id: true,
  lastUpdated: true,
});

// Types
export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;
export type UploadedFile = typeof uploadedFiles.$inferSelect;
export type InsertUsage = z.infer<typeof insertUsageSchema>;
export type UsageStats = typeof usageStats.$inferSelect;
