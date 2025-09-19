import { useState } from 'react'
import { QuestionInput } from '../QuestionInput'

export default function QuestionInputExample() {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleSubmit = (question: string) => {
    console.log('Question submitted:', question)
    setIsLoading(true)
    // Simulate loading
    setTimeout(() => setIsLoading(false), 2000)
  }
  
  return (
    <div className="p-6 max-w-2xl">
      <QuestionInput 
        onSubmit={handleSubmit}
        isLoading={isLoading}
        placeholder="What are the latest trends in AI research?"
      />
    </div>
  )
}