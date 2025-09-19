import { HeroSection } from "@/components/HeroSection"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, Zap, Shield, TrendingUp, FileText } from "lucide-react"
import { useLocation } from "wouter"

export default function Landing() {
  const [, setLocation] = useLocation()
  
  const handleGetStarted = () => {
    setLocation('/home')
  }

  return (
    <div className="min-h-screen">
      <HeroSection onGetStarted={handleGetStarted} />
      
      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="secondary" className="mb-4">Key Features</Badge>
            <h2 className="text-3xl font-bold">Everything you need for research</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful AI-driven research capabilities with transparent pricing and usage tracking
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover-elevate">
              <CardHeader>
                <FileText className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Document Intelligence</CardTitle>
                <CardDescription>
                  Upload research papers, reports, and documents for AI-powered analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Multi-format support (PDF, DOC, TXT)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Automated content extraction
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Cross-document analysis
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="hover-elevate">
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Live Data Integration</CardTitle>
                <CardDescription>
                  Stay current with real-time data from multiple sources via Pathway
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Real-time market data
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    News and article feeds
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Automatic freshness tracking
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="hover-elevate">
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Transparent Billing</CardTitle>
                <CardDescription>
                  Clear usage tracking with Flexprice integration for fair pricing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Pay per question and report
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Real-time credit tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Usage history and analytics
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl font-bold">Simple 3-step process</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From question to comprehensive report in minutes
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold">Upload & Ask</h3>
              <p className="text-muted-foreground">
                Upload your research documents and ask your research question
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold">AI Analysis</h3>
              <p className="text-muted-foreground">
                Our AI analyzes your documents alongside live data sources
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold">Get Results</h3>
              <p className="text-muted-foreground">
                Receive a structured report with key insights and verified citations
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Ready to transform your research?</h2>
            <p className="text-muted-foreground text-lg">
              Join researchers and analysts who trust our AI-powered platform for evidence-based insights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleGetStarted} className="text-lg px-8">
                Start Research
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}