import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CreditCard } from "lucide-react"

interface UsageCounterProps {
  questionsUsed: number
  reportsGenerated: number
  totalCredits: number
  creditsUsed: number
}

export function UsageCounter({ questionsUsed, reportsGenerated, totalCredits, creditsUsed }: UsageCounterProps) {
  const usagePercentage = Math.round((creditsUsed / totalCredits) * 100)
  
  return (
    <div className="flex items-center gap-4 p-4 bg-card border border-card-border rounded-lg">
      <CreditCard className="h-5 w-5 text-muted-foreground" />
      
      <div className="flex items-center gap-2">
        <Badge variant="secondary" data-testid="badge-questions-used">
          {questionsUsed} questions asked
        </Badge>
        <Badge variant="secondary" data-testid="badge-reports-generated">
          {reportsGenerated} reports generated
        </Badge>
      </div>
      
      <div className="flex items-center gap-2 min-w-[120px]">
        <Progress value={usagePercentage} className="flex-1" />
        <span className="text-sm font-medium whitespace-nowrap" data-testid="text-credits-used">
          {creditsUsed}/{totalCredits} credits
        </span>
      </div>
    </div>
  )
}