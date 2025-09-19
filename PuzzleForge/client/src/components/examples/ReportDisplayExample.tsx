import { ReportDisplay } from '../ReportDisplay'

export default function ReportDisplayExample() {
  //todo: remove mock functionality
  const sampleReport = {
    id: '1',
    question: 'What are the current trends in renewable energy adoption globally?',
    keyTakeaways: [
      'Solar energy capacity increased by 22% globally in 2023',
      'Wind energy now represents 15% of total global electricity generation',
      'Battery storage costs have decreased by 40% over the past two years',
      'Government subsidies remain crucial for renewable energy adoption'
    ],
    insights: 'The renewable energy sector is experiencing unprecedented growth driven by technological advances, decreasing costs, and supportive government policies. Solar and wind technologies are leading this transformation, with battery storage becoming increasingly viable for grid-scale applications.',
    fullReport: `The renewable energy landscape has undergone significant transformation in recent years. According to the International Energy Agency, global renewable capacity additions reached record levels in 2023, with solar photovoltaic (PV) accounting for nearly 60% of all renewable capacity additions.\n\nKey market drivers include:\n- Declining technology costs\n- Supportive policy frameworks\n- Corporate renewable energy procurement\n- Grid integration improvements\n\nChallenges remain in terms of grid stability, energy storage, and policy consistency across different regions. However, the overall trajectory remains strongly positive for renewable energy adoption worldwide.`,
    citations: [
      {
        id: '1',
        title: 'IEA World Energy Outlook 2023',
        url: '#',
        type: 'document' as const
      },
      {
        id: '2',
        title: 'Global Wind Energy Council Report',
        url: '#', 
        type: 'web' as const
      },
      {
        id: '3',
        title: 'Real-time Energy Market Data',
        type: 'live-data' as const
      }
    ],
    generatedAt: '2024-01-16T10:30:00Z',
    lastUpdated: '2024-01-16T14:15:00Z',
    creditsUsed: 3
  }
  
  return (
    <div className="p-6 max-w-4xl">
      <ReportDisplay 
        report={sampleReport}
        onCitationClick={(citation) => console.log('Citation clicked:', citation)}
      />
    </div>
  )
}