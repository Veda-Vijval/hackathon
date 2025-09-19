import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Clock, Download, Share } from "lucide-react"
import { CitationPill, type Citation } from "./CitationPill"

export interface Report {
  id: string
  question: string
  keyTakeaways: string[]
  insights: string
  fullReport: string
  citations: Citation[]
  generatedAt: string
  lastUpdated: string
  creditsUsed: number
}

interface ReportDisplayProps {
  report: Report
  onCitationClick?: (citation: Citation) => void
}

export function ReportDisplay({ report, onCitationClick }: ReportDisplayProps) {
  const handleDownload = () => {
    console.log('Download report:', report.id)
    // TODO: Implement actual download functionality
  }

  const handleShare = () => {
    console.log('Share report:', report.id)
    // TODO: Implement actual share functionality
  }

  return (
    <Card className="p-6 space-y-6">
      {/* Report Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-semibold leading-tight" data-testid="report-question">
            {report.question}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare} data-testid="button-share-report">
              <Share className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} data-testid="button-download-report">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Generated {new Date(report.generatedAt).toLocaleString()}</span>
          </div>
          {report.lastUpdated !== report.generatedAt && (
            <div className="flex items-center gap-1">
              <Badge variant="secondary" className="text-xs">
                Updated {new Date(report.lastUpdated).toLocaleString()}
              </Badge>
            </div>
          )}
          <Badge variant="outline" className="text-xs" data-testid="badge-credits-used">
            {report.creditsUsed} credits used
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Key Takeaways */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Key Takeaways</h3>
        <div className="grid gap-2">
          {report.keyTakeaways.map((takeaway, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
              <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                {index + 1}
              </div>
              <p className="text-sm" data-testid={`takeaway-${index}`}>{takeaway}</p>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Detailed Insights */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Detailed Analysis</h3>
        <div className="prose prose-sm max-w-none" data-testid="report-insights">
          <p>{report.insights}</p>
        </div>
      </div>

      <Separator />

      {/* Full Report */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Full Report</h3>
        <div className="prose prose-sm max-w-none text-muted-foreground" data-testid="report-content">
          <div className="whitespace-pre-wrap">{report.fullReport}</div>
        </div>
      </div>

      <Separator />

      {/* Citations */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Sources & Citations ({report.citations.length})</h3>
        <div className="flex flex-wrap gap-2">
          {report.citations.map((citation) => (
            <CitationPill
              key={citation.id}
              citation={citation}
              onClick={onCitationClick}
            />
          ))}
        </div>
      </div>
    </Card>
  )
}