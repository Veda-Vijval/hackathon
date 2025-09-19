import { Dashboard } from "@/components/Dashboard"
import { UsageCounter } from "@/components/UsageCounter"
import { Button } from "@/components/ui/button"
import { RefreshCw, Plus } from "lucide-react"
import { useLocation } from "wouter"
import { useQuery } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const [, setLocation] = useLocation()
  const { toast } = useToast()
  
  // Fetch dashboard stats from API
  const { data: dashboardStats, isLoading, refetch } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/stats?userId=default')
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats')
      }
      return response.json()
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  })
  
  // Fetch usage stats from API
  const { data: usageStats } = useQuery({
    queryKey: ['/api/usage'],
    queryFn: async () => {
      const response = await fetch('/api/usage?userId=default')
      if (!response.ok) {
        throw new Error('Failed to fetch usage stats')
      }
      return response.json()
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  })
  
  const handleReportClick = (reportId: string) => {
    console.log('Navigating to report:', reportId)
    // TODO: Navigate to report details page
  }
  
  const handleRefresh = async () => {
    console.log('Refreshing dashboard data')
    try {
      await refetch()
      toast({
        title: "Data Refreshed",
        description: "Dashboard data has been updated.",
      })
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh dashboard data.",
        variant: "destructive",
      })
    }
  }
  
  const handleNewReport = () => {
    setLocation('/home')
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Research Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your research activity and data source status
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleRefresh} data-testid="button-refresh">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleNewReport} data-testid="button-new-report">
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>
      
      {/* Usage Counter */}
      {usageStats && (
        <UsageCounter 
          questionsUsed={usageStats.totalQuestions}
          reportsGenerated={usageStats.totalReports}
          totalCredits={usageStats.totalCreditsAvailable}
          creditsUsed={usageStats.totalCreditsUsed}
        />
      )}
      
      {/* Main Dashboard */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard data...</p>
        </div>
      ) : dashboardStats ? (
        <Dashboard 
          stats={dashboardStats}
          onReportClick={handleReportClick}
        />
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No data available. Start by generating your first report!</p>
        </div>
      )}
    </div>
  )
}