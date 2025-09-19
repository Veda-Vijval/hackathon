import { Badge } from "@/components/ui/badge"
import { ExternalLink, FileText, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface Citation {
  id: string
  title: string
  url?: string
  type: 'document' | 'web' | 'live-data'
  lastUpdated?: string
}

interface CitationPillProps {
  citation: Citation
  onClick?: (citation: Citation) => void
}

export function CitationPill({ citation, onClick }: CitationPillProps) {
  const getIcon = () => {
    switch (citation.type) {
      case 'document':
        return <FileText className="h-3 w-3" />
      case 'web':
        return <Globe className="h-3 w-3" />
      case 'live-data':
        return <ExternalLink className="h-3 w-3" />
      default:
        return <FileText className="h-3 w-3" />
    }
  }

  const handleClick = () => {
    if (onClick) {
      onClick(citation)
    } else if (citation.url) {
      window.open(citation.url, '_blank')
    }
    console.log('Citation clicked:', citation.title)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className="h-6 px-2 text-xs font-normal gap-1 hover-elevate"
      data-testid={`citation-${citation.id}`}
    >
      {getIcon()}
      <span className="truncate max-w-[120px]">{citation.title}</span>
      {citation.type === 'live-data' && (
        <Badge variant="secondary" className="h-4 px-1 text-xs ml-1">
          Live
        </Badge>
      )}
    </Button>
  )
}