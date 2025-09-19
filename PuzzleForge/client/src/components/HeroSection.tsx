import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, Search, TrendingUp } from "lucide-react"
import heroImage from "@assets/generated_images/Data_flow_research_illustration_ae92d6f1.png"

interface HeroSectionProps {
  onGetStarted?: () => void
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  const handleGetStarted = () => {
    console.log('Get started clicked')
    onGetStarted?.()
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight lg:text-6xl">
                AI-Powered
                <span className="text-primary block">Research Assistant</span>
              </h1>
              <p className="text-xl text-muted-foreground lg:text-2xl leading-relaxed">
                Generate structured, evidence-based reports with fresh data from multiple sources. 
                Get cited insights with transparent usage tracking.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Search className="h-4 w-4" />
                <span>Question-driven research</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Structured reports</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Live data integration</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="text-lg px-8"
                data-testid="button-get-started"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8" data-testid="button-learn-more">
                Learn More
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="pt-8 border-t border-border">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">10k+</div>
                  <div className="text-sm text-muted-foreground">Reports Generated</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">99%</div>
                  <div className="text-sm text-muted-foreground">Citation Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Live Data Updates</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl">
              <img 
                src={heroImage} 
                alt="Research data flow illustration showing connected sources feeding into structured reports" 
                className="w-full h-auto"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent" />
            </div>
            
            {/* Floating elements for visual interest */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-chart-2/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </div>
  )
}