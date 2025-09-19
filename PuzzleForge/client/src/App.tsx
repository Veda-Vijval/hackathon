import { Switch, Route } from "wouter"
import { queryClient } from "./lib/queryClient"
import { QueryClientProvider, useQuery } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { ThemeProvider } from "@/components/ThemeProvider"
import { ThemeToggle } from "@/components/ThemeToggle"
import { UsageCounter } from "@/components/UsageCounter"
import Landing from "@/pages/Landing"
import Home from "@/pages/Home"
import DashboardPage from "@/pages/DashboardPage"
import NotFound from "@/pages/not-found"
import { useLocation } from "wouter"

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/home" component={Home} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/reports" component={Home} /> {/* TODO: Create dedicated reports page */}
      <Route path="/settings" component={() => <div className="p-8"><h1>Settings - Coming Soon</h1></div>} />
      <Route path="/help" component={() => <div className="p-8"><h1>Help - Coming Soon</h1></div>} />
      <Route component={NotFound} />
    </Switch>
  )
}

function AppContent() {
  const [location] = useLocation()
  const isLandingPage = location === '/'
  
  // Fetch real usage data
  const { data: usageData } = useQuery({
    queryKey: ['/api/usage'],
    queryFn: async () => {
      const response = await fetch('/api/usage?userId=default')
      if (!response.ok) {
        return { totalQuestions: 0, totalReports: 0, totalCreditsAvailable: 100, totalCreditsUsed: 0 }
      }
      return response.json()
    },
    refetchInterval: 30000,
  })
  
  const displayUsageData = usageData || {
    totalQuestions: 0,
    totalReports: 0, 
    totalCreditsAvailable: 100,
    totalCreditsUsed: 0
  }

  if (isLandingPage) {
    return <Router />
  }

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-lg">Research Assistant</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden lg:block">
                <UsageCounter 
                  questionsUsed={displayUsageData.totalQuestions}
                  reportsGenerated={displayUsageData.totalReports}
                  totalCredits={displayUsageData.totalCreditsAvailable}
                  creditsUsed={displayUsageData.totalCreditsUsed}
                />
              </div>
              <ThemeToggle />
            </div>
          </header>
          
          {/* Mobile usage counter */}
          <div className="lg:hidden p-4 border-b">
            <UsageCounter 
              questionsUsed={displayUsageData.totalQuestions}
              reportsGenerated={displayUsageData.totalReports}
              totalCredits={displayUsageData.totalCreditsAvailable}
              creditsUsed={displayUsageData.totalCreditsUsed}
            />
          </div>
          
          <main className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <Router />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="research-assistant-theme">
        <TooltipProvider>
          <AppContent />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
