import { type User, type InsertUser, type Report, type InsertReport, type UploadedFile, type InsertFile, type UsageStats, type InsertUsage } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Report methods
  createReport(report: InsertReport): Promise<Report>;
  getReport(id: string): Promise<Report | undefined>;
  getRecentReports(userId?: string, limit?: number): Promise<Report[]>;
  
  // File methods
  uploadFile(file: InsertFile): Promise<UploadedFile>;
  getFile(id: string): Promise<UploadedFile | undefined>;
  getUserFiles(userId?: string): Promise<UploadedFile[]>;
  
  // Usage tracking methods
  getUsageStats(userId?: string): Promise<UsageStats | undefined>;
  updateUsageStats(userId: string | undefined, update: Partial<InsertUsage>): Promise<UsageStats>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private reports: Map<string, Report>;
  private files: Map<string, UploadedFile>;
  private usageStats: Map<string, UsageStats>;

  constructor() {
    this.users = new Map();
    this.reports = new Map();
    this.files = new Map();
    this.usageStats = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Report methods
  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = randomUUID();
    const now = new Date();
    const report: Report = {
      id,
      question: insertReport.question,
      keyTakeaways: Array.isArray(insertReport.keyTakeaways) ? insertReport.keyTakeaways : [],
      insights: insertReport.insights,
      fullReport: insertReport.fullReport,
      citations: Array.isArray(insertReport.citations) ? insertReport.citations : [],
      creditsUsed: insertReport.creditsUsed,
      userId: insertReport.userId || null,
      generatedAt: now,
      lastUpdated: now,
    };
    this.reports.set(id, report);
    
    // Update usage stats
    await this.updateUsageStats(insertReport.userId || undefined, {
      totalReports: 1,
      totalQuestions: 1,
      totalCreditsUsed: insertReport.creditsUsed,
    });
    
    return report;
  }

  async getReport(id: string): Promise<Report | undefined> {
    return this.reports.get(id);
  }

  async getRecentReports(userId?: string, limit = 10): Promise<Report[]> {
    const allReports = Array.from(this.reports.values())
      .filter(report => !userId || report.userId === userId)
      .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
      .slice(0, limit);
    return allReports;
  }

  // File methods
  async uploadFile(insertFile: InsertFile): Promise<UploadedFile> {
    const id = randomUUID();
    const file: UploadedFile = {
      ...insertFile,
      id,
      userId: insertFile.userId || null,
      content: insertFile.content || null,
      uploadedAt: new Date(),
    };
    this.files.set(id, file);
    return file;
  }

  async getFile(id: string): Promise<UploadedFile | undefined> {
    return this.files.get(id);
  }

  async getUserFiles(userId?: string): Promise<UploadedFile[]> {
    return Array.from(this.files.values())
      .filter(file => !userId || file.userId === userId);
  }

  // Usage tracking methods
  async getUsageStats(userId = 'default'): Promise<UsageStats | undefined> {
    if (!this.usageStats.has(userId)) {
      // Create default usage stats
      const defaultStats: UsageStats = {
        id: randomUUID(),
        userId,
        totalQuestions: 0,
        totalReports: 0,
        totalCreditsUsed: 0,
        totalCreditsAvailable: 100,
        lastUpdated: new Date(),
      };
      this.usageStats.set(userId, defaultStats);
    }
    return this.usageStats.get(userId);
  }

  async updateUsageStats(userId = 'default', update: Partial<InsertUsage>): Promise<UsageStats> {
    let stats = await this.getUsageStats(userId);
    if (!stats) {
      stats = {
        id: randomUUID(),
        userId,
        totalQuestions: 0,
        totalReports: 0,
        totalCreditsUsed: 0,
        totalCreditsAvailable: 100,
        lastUpdated: new Date(),
      };
    }
    
    const newCreditsUsed = stats.totalCreditsUsed + (update.totalCreditsUsed || 0);
    
    // Check if user has enough credits
    if (newCreditsUsed > stats.totalCreditsAvailable) {
      throw new Error(`Insufficient credits. Need ${update.totalCreditsUsed || 0} but only ${stats.totalCreditsAvailable - stats.totalCreditsUsed} available.`);
    }
    
    const updatedStats: UsageStats = {
      ...stats,
      totalQuestions: stats.totalQuestions + (update.totalQuestions || 0),
      totalReports: stats.totalReports + (update.totalReports || 0),
      totalCreditsUsed: newCreditsUsed,
      totalCreditsAvailable: update.totalCreditsAvailable ?? stats.totalCreditsAvailable,
      lastUpdated: new Date(),
    };
    
    this.usageStats.set(userId, updatedStats);
    return updatedStats;
  }
}

export const storage = new MemStorage();
