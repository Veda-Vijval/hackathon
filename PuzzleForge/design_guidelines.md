# Research Assistant Agent Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from professional research tools like Notion, Linear, and academic platforms like ResearchGate. The design prioritizes clarity, trust, and efficient information consumption for researchers and analysts.

## Core Design Elements

### A. Color Palette
**Primary Brand Colors:**
- Primary: 220 85% 25% (Deep research blue)
- Secondary: 210 15% 95% (Light gray backgrounds)
- Success: 142 76% 36% (Report completion green)
- Warning: 45 93% 47% (Credit usage orange)

**Dark Mode:**
- Background: 220 13% 9%
- Surface: 220 13% 14%
- Text: 220 9% 89%

### B. Typography
**Font Stack:** Inter via Google Fonts
- Headlines: 600 weight, large sizes for report titles
- Body: 400 weight for readability
- Captions: 500 weight for citations and metadata
- Code/Data: JetBrains Mono for structured outputs

### C. Layout System
**Spacing Units:** Tailwind units of 2, 4, 6, and 8 (p-2, m-4, gap-6, h-8)
- Consistent 6-unit gaps between major sections
- 4-unit padding for cards and containers
- 2-unit spacing for tight element groupings

### D. Component Library

**Core Components:**
- **Question Input Card:** Prominent search-style input with animated submit
- **Report Cards:** Clean white/dark cards with clear typography hierarchy
- **Credit Counter:** Always-visible badge showing usage (e.g., "3/10 reports used")
- **Citation Pills:** Small, rounded badges linking to sources
- **Progress Indicators:** Subtle loading states during report generation
- **Dashboard Tiles:** Grid-based metrics cards for usage analytics

**Navigation:**
- Clean sidebar with research categories
- Breadcrumb navigation for report drilling
- Quick access to recent reports

**Data Displays:**
- **Source Timeline:** Shows when new data was ingested via Pathway
- **Key Insights Cards:** Highlighted takeaways with visual emphasis
- **Usage Dashboard:** Clean charts showing billing metrics

### E. Key Experience Patterns

**Trust & Credibility:**
- Citations always visible with source preview on hover
- "Last updated" timestamps prominent on all data
- Clear data freshness indicators

**Billing Transparency:**
- Real-time credit counters in header
- Cost preview before expensive operations
- Usage history easily accessible

**Research Flow:**
- Progressive disclosure: overview → detailed report → sources
- Save/bookmark functionality for important reports
- Export options for generated content

## Images
**Hero Section:** Large, clean illustration showing connected data sources flowing into structured reports. Should convey intelligence and connectivity without being overwhelming.

**Dashboard Graphics:** Simple data visualization icons and charts to represent the analytical nature of the platform.

**No decorative images** - focus on functional illustrations that enhance understanding of the research process.