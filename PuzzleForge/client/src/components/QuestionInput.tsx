import { useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface QuestionInputProps {
  onSubmit: (question: string) => void
  isLoading?: boolean
  placeholder?: string
}

export function QuestionInput({ 
  onSubmit, 
  isLoading = false, 
  placeholder = "Ask a research question..." 
}: QuestionInputProps) {
  const [question, setQuestion] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (question.trim() && !isLoading) {
      onSubmit(question.trim())
      setQuestion("")
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={placeholder}
            className="pl-10"
            disabled={isLoading}
            data-testid="input-research-question"
          />
        </div>
        <Button 
          type="submit" 
          disabled={!question.trim() || isLoading}
          data-testid="button-submit-question"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Generate Report"
          )}
        </Button>
      </form>
    </Card>
  )
}