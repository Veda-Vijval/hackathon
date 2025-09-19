import { HeroSection } from '../HeroSection'

export default function HeroSectionExample() {
  const handleGetStarted = () => {
    console.log('Get started clicked - would navigate to main app')
  }
  
  return (
    <HeroSection onGetStarted={handleGetStarted} />
  )
}