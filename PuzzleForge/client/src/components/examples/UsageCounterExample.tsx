import { UsageCounter } from '../UsageCounter'

export default function UsageCounterExample() {
  //todo: remove mock functionality
  return (
    <div className="p-6 max-w-2xl">
      <UsageCounter 
        questionsUsed={12}
        reportsGenerated={8}
        totalCredits={100}
        creditsUsed={45}
      />
    </div>
  )
}