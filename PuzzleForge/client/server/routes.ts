import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";
import { insertReportSchema, insertFileSchema, type Citation } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import { Request } from "express";

// Configure OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Enhanced request type for file uploads
interface MulterRequest extends Request {
  files?: Express.Multer.File[];
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Get usage statistics
  app.get("/api/usage", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const stats = await storage.getUsageStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching usage stats:", error);
      res.status(500).json({ error: "Failed to fetch usage statistics" });
    }
  });

  // Get recent reports
  app.get("/api/reports", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const reports = await storage.getRecentReports(userId, limit);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });

  // Get specific report
  app.get("/api/reports/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const report = await storage.getReport(id);
      
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }
      
      res.json(report);
    } catch (error) {
      console.error("Error fetching report:", error);
      res.status(500).json({ error: "Failed to fetch report" });
    }
  });

  // Upload files
  app.post("/api/files/upload", upload.array('files'), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      
      // Validate request
      const requestSchema = z.object({
        userId: z.string().optional(),
      });
      
      const validation = requestSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: validation.error.errors 
        });
      }
      
      const { userId } = validation.data;
      
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }
      
      const uploadedFiles = [];
      
      for (const file of files) {
        // Extract text content (basic implementation)
        let content = "";
        if (file.mimetype.startsWith('text/')) {
          content = file.buffer.toString('utf-8');
        } else {
          // For non-text files, store metadata only for now
          content = `Binary file: ${file.originalname} (${file.size} bytes)`;
        }
        
        const uploadedFile = await storage.uploadFile({
          name: file.originalname,
          size: file.size,
          type: file.mimetype,
          content,
          userId,
        });
        
        uploadedFiles.push(uploadedFile);
      }
      
      res.json({ files: uploadedFiles });
    } catch (error) {
      console.error("Error uploading files:", error);
      res.status(500).json({ error: "Failed to upload files" });
    }
  });

  // Generate research report
  app.post("/api/research/generate", async (req, res) => {
    try {
      // Validate request body
      const requestSchema = z.object({
        question: z.string().min(1, "Question is required"),
        userId: z.string().optional(),
        fileIds: z.array(z.string()).optional(),
      });
      
      const validation = requestSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: "Invalid request data", 
          details: validation.error.errors 
        });
      }
      
      const { question, userId, fileIds } = validation.data;
      
      // Check if OpenAI API key is available
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "OpenAI API key not configured" });
      }
      
      // Get uploaded files for context
      const userFiles = await storage.getUserFiles(userId);
      const relevantFiles = fileIds 
        ? userFiles.filter(f => fileIds.includes(f.id))
        : userFiles.slice(-5); // Use last 5 files if no specific files provided
      
      // Prepare context from files
      const fileContext = relevantFiles
        .map(f => `Document: ${f.name}\nContent: ${f.content?.slice(0, 2000)}...`)
        .join('\n\n');
      
      // Generate research report using OpenAI
      const systemPrompt = `You are a research assistant that generates comprehensive, evidence-based reports. 
Analyze the provided documents and research question to create a structured report with:
1. Key takeaways (3-5 bullet points)
2. Detailed insights paragraph
3. Full comprehensive report
4. Suggest relevant citations

Be thorough, factual, and cite sources appropriately.`;
      
      const userPrompt = `Research Question: ${question}

${fileContext ? `Available Documents:\n${fileContext}\n\n` : ''}Please generate a comprehensive research report addressing this question.`;
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      });
      
      const aiResponse = completion.choices[0]?.message?.content || "Unable to generate report";
      
      // Parse AI response (simplified - in production, use structured output)
      const keyTakeaways = [
        "AI-powered analysis of provided documents and research question",
        "Cross-referenced findings from uploaded materials",
        "Evidence-based insights with source attribution",
        "Comprehensive research synthesis and recommendations"
      ];
      
      const insights = aiResponse.slice(0, 500) + "...";
      const fullReport = aiResponse;
      
      // Generate citations based on files used
      const citations: Citation[] = relevantFiles.map((file, index) => ({
        id: `${file.id}-${index}`,
        title: file.name,
        type: 'document' as const,
        lastUpdated: file.uploadedAt.toISOString(),
      }));
      
      // Add mock live data citation
      citations.push({
        id: 'live-data-1',
        title: 'Real-time Research Database',
        type: 'live-data' as const,
        lastUpdated: new Date().toISOString(),
      });
      
      // Calculate credits used (simplified) - 1 credit per 100 tokens
      const creditsUsed = Math.ceil((completion.usage?.total_tokens ?? 1000) / 100);
      
      // Save report
      const report = await storage.createReport({
        question,
        keyTakeaways,
        insights,
        fullReport,
        citations,
        creditsUsed,
        userId,
      });
      
      res.json(report);
      
    } catch (error) {
      console.error("Error generating research report:", error);
      res.status(500).json({ error: "Failed to generate research report" });
    }
  });

  // Dashboard stats endpoint
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      
      const [usageStats, recentReports] = await Promise.all([
        storage.getUsageStats(userId),
        storage.getRecentReports(userId, 5)
      ]);
      
      // Mock data freshness for now
      const dataFreshness = [
        {
          source: 'Academic Papers Database',
          lastUpdate: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
          status: 'fresh' as const
        },
        {
          source: 'News Aggregator API',
          lastUpdate: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 min ago
          status: 'updating' as const
        },
        {
          source: 'Market Data Feed',
          lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          status: 'stale' as const
        }
      ];
      
      const stats = {
        totalQuestions: usageStats?.totalQuestions || 0,
        totalReports: usageStats?.totalReports || 0,
        totalCreditsUsed: usageStats?.totalCreditsUsed || 0,
        totalCreditsAvailable: usageStats?.totalCreditsAvailable || 100,
        recentReports: recentReports.map(r => ({
          id: r.id,
          question: r.question,
          generatedAt: r.generatedAt.toISOString(),
          creditsUsed: r.creditsUsed,
        })),
        dataFreshness,
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ error: "Failed to fetch dashboard statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
