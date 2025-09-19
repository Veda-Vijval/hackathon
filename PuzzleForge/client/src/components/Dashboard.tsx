import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, FileText, Search, Clock, Database } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardStats {
  totalQuestions: number
  totalReports: number
  totalCreditsUsed: number
  totalCreditsAvailable: number
  recentReports: Array<{
    id: string
    question: string
    generatedAt: string
    creditsUsed: number
  }>
  dataFreshness: Array<{
    source: string
    lastUpdate: string
    status: 'fresh' | 'stale' | 'updating'
  }>
}

interface DashboardProps {
  stats: DashboardStats
  onReportClick?: (reportId: string) => void
}

export function Dashboard({ stats, onReportClick }: DashboardProps) {
  const usagePercentage = Math.round((stats.totalCreditsUsed / stats.totalCreditsAvailable) * 100)
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'fresh':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Fresh</Badge>
      case 'updating':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Updating</Badge>
      case 'stale':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">Stale</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-total-questions">{stats.totalQuestions}</div>
            <p className="text-xs text-muted-foreground">Research queries processed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-total-reports">{stats.totalReports}</div>
            <p className="text-xs text-muted-foreground">Structured research reports</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Used</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-credits-used">
              {stats.totalCreditsUsed}/{stats.totalCreditsAvailable}
            </div>
            <div className="mt-2">
              <Progress value={usagePercentage} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{usagePercentage}% of available credits</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-data-sources">{stats.dataFreshness.length}</div>
            <p className="text-xs text-muted-foreground">Active data connections</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Your latest research reports and analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentReports.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No reports generated yet</p>
            ) : (
              stats.recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 hover-elevate rounded-lg border cursor-pointer"
                  onClick={() => onReportClick?.(report.id)}
                  data-testid={`recent-report-${report.id}`}
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{report.question}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(report.generatedAt).toLocaleString()}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {report.creditsUsed} credits
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Freshness */}
      <Card>
        <CardHeader>
          <CardTitle>Data Source Status</CardTitle>
          <CardDescription>Monitor the freshness of your connected data sources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.dataFreshness.map((source, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
                data-testid={`data-source-${index}`}
              >
                <div className="flex items-center gap-3">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{source.source}</p>
                    <p className="text-xs text-muted-foreground">
                      Last updated: {new Date(source.lastUpdate).toLocaleString()}
                    </p>
                  </div>
                </div>
                {getStatusBadge(source.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}