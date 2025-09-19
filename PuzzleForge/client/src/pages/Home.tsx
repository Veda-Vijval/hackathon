import { useState } from "react"
import { QuestionInput } from "@/components/QuestionInput"
import { FileUpload } from "@/components/FileUpload"
import { ReportDisplay, type Report } from "@/components/ReportDisplay"
import { type Citation } from "@/components/CitationPill"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Zap, TrendingUp, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiRequest } from "@/lib/queryClient"

export default function Home() {
  const [currentReport, setCurrentReport] = useState<Report | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const { toast } = useToast()
  
  const handleQuestionSubmit = async (question: string) => {
    console.log('Generating report for:', question)
    setIsGenerating(true)
    
    try {
      const fileIds = uploadedFiles.map(f => f.id)
      
      const report = await apiRequest('/api/research/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          userId: 'default', // TODO: Replace with actual user ID
          fileIds,
        }),
      }) as Report
      
      setCurrentReport(report)
      toast({
        title: "Report Generated",
        description: `Used ${report.creditsUsed} credits for this analysis.`,
      })
      
    } catch (error) {
      console.error('Error generating report:', error)
      toast({
        title: "Error",
        description: "Failed to generate research report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCitationClick = (citation: Citation) => {
    console.log('Citation clicked:', citation)
    // TODO: Open citation details or navigate to source
  }

  const handleFilesUploaded = async (files: File[]) => {
    try {
      const formData = new FormData()
      files.forEach((file, index) => {
        formData.append('files', file)
      })
      formData.append('userId', 'default') // TODO: Replace with actual user ID
      
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Upload failed')
      }
      
      const result = await response.json()
      setUploadedFiles(result.files)
      
      toast({
        title: "Files Uploaded",
        description: `Successfully uploaded ${result.files.length} files.`,
      })
      
      console.log('Files uploaded:', result.files.length)
    } catch (error) {
      console.error('Error uploading files:', error)
      toast({
        title: "Upload Error",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Research Assistant</h1>
        <p className="text-muted-foreground text-lg">
          Ask questions, upload documents, and get comprehensive research reports with citations
        </p>
      </div>

      {/* Quick Features */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="text-center">
          <CardHeader className="pb-3">
            <FileText className="h-8 w-8 text-primary mx-auto" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-sm">Document Analysis</CardTitle>
            <CardDescription className="text-xs">Upload and analyze research documents</CardDescription>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardHeader className="pb-3">
            <Zap className="h-8 w-8 text-primary mx-auto" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-sm">AI-Powered Insights</CardTitle>
            <CardDescription className="text-xs">Get intelligent analysis and summaries</CardDescription>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardHeader className="pb-3">
            <TrendingUp className="h-8 w-8 text-primary mx-auto" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-sm">Live Data Integration</CardTitle>
            <CardDescription className="text-xs">Fresh insights from real-time sources</CardDescription>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardHeader className="pb-3">
            <Shield className="h-8 w-8 text-primary mx-auto" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-sm">Verified Citations</CardTitle>
            <CardDescription className="text-xs">Traceable and reliable sources</CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* File Upload */}
      <FileUpload onFilesUploaded={handleFilesUploaded} />
      
      {/* Question Input */}
      <QuestionInput 
        onSubmit={handleQuestionSubmit}
        isLoading={isGenerating}
        placeholder="What would you like to research today?"
      />

      {/* Loading State */}
      {isGenerating && (
        <Card className="p-8">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <div className="space-y-2">
              <p className="font-medium">Generating your research report...</p>
              <p className="text-sm text-muted-foreground">
                Analyzing {uploadedFiles.length} documents and fetching fresh data
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Report Display */}
      {currentReport && !isGenerating && (
        <ReportDisplay 
          report={currentReport}
          onCitationClick={handleCitationClick}
        />
      )}
      
      {/* Getting Started Help */}
      {!currentReport && !isGenerating && (
        <Card className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">Ready to get started?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={() => handleQuestionSubmit('What are the latest trends in artificial intelligence?')}>
                Try Example Question
              </Button>
              <Button variant="outline">
                View Sample Report
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}