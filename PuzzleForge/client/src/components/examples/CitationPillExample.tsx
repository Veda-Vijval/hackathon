import { CitationPill } from '../CitationPill'

export default function CitationPillExample() {
  //todo: remove mock functionality
  const sampleCitations = [
    {
      id: '1',
      title: 'Research Paper on AI Ethics',
      url: '#',
      type: 'document' as const,
      lastUpdated: '2024-01-15'
    },
    {
      id: '2', 
      title: 'MIT Technology Review',
      url: '#',
      type: 'web' as const,
      lastUpdated: '2024-01-16'
    },
    {
      id: '3',
      title: 'Real-time Market Data',
      type: 'live-data' as const,
      lastUpdated: '2024-01-16'
    }
  ]
  
  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap gap-2">
        {sampleCitations.map(citation => (
          <CitationPill 
            key={citation.id}
            citation={citation}
            onClick={(cite) => console.log('Clicked citation:', cite)}
          />
        ))}
      </div>
    </div>
  )
}