import { Dashboard } from '../Dashboard'

export default function DashboardExample() {
  //todo: remove mock functionality
  const sampleStats = {
    totalQuestions: 47,
    totalReports: 32,
    totalCreditsUsed: 156,
    totalCreditsAvailable: 500,
    recentReports: [
      {
        id: '1',
        question: 'What are the latest developments in quantum computing?',
        generatedAt: '2024-01-16T09:30:00Z',
        creditsUsed: 4
      },
      {
        id: '2', 
        question: 'How is climate change affecting agricultural yields?',
        generatedAt: '2024-01-15T14:20:00Z',
        creditsUsed: 3
      },
      {
        id: '3',
        question: 'What are the emerging trends in fintech?',
        generatedAt: '2024-01-15T11:45:00Z',
        creditsUsed: 5
      }
    ],
    dataFreshness: [
      {
        source: 'Academic Papers Database',
        lastUpdate: '2024-01-16T12:00:00Z',
        status: 'fresh' as const
      },
      {
        source: 'News Aggregator API',
        lastUpdate: '2024-01-16T11:30:00Z', 
        status: 'updating' as const
      },
      {
        source: 'Market Data Feed',
        lastUpdate: '2024-01-15T18:00:00Z',
        status: 'stale' as const
      }
    ]
  }
  
  return (
    <div className="p-6">
      <Dashboard 
        stats={sampleStats}
        onReportClick={(id) => console.log('Report clicked:', id)}
      />
    </div>
  )
}