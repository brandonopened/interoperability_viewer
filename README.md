# Interoperability Specification Viewer

An interactive web application for exploring and comparing educational and credentialing data standards including specifications from 1EdTech, Credential Engine, HR Open, and CEDS.

## Features

### Specification Viewer
- Browse 8 major specifications across 4 organizations
- View detailed schemas, examples, diagrams, and terminology
- Explore entity relationships and data structures
- Access official specification documentation

### AI-Powered Comparison (NEW!)
- Compare any two specifications side-by-side
- Analyze structural similarities and differences
- Identify vocabulary overlap and unique terms
- Discover interoperability opportunities
- Get AI-generated insights on how specifications relate

## Included Specifications

### 1EdTech (4 specifications)
- CLR 2.0 (Comprehensive Learner Record)
- CASE 1.0 & 1.1 (Competency and Academic Standards Exchange)
- Open Badges 3.0

### Credential Engine (1 specification)
- CTDL (Credential Transparency Description Language)

### HR Open (2 specifications)
- LER-RS 2.0 (Learning & Employment Record Reference Specification)
- Skills API 1.0

### CEDS (1 specification)
- CEDS 12.1 (Common Education Data Standards)

## Setup

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure your OpenAI API key in `.env`:
```bash
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Using the Comparison Feature

1. Click the "Compare" button in the header
2. Select two specifications from the dropdown menus
3. Click "Compare Specifications"
4. The AI will analyze both specifications and provide:
   - **Structural Similarities**: Common architectural patterns
   - **Structural Differences**: Key design differences
   - **Vocabulary Overlap**: Shared terms and concepts
   - **Unique Vocabulary**: Terms specific to each specification
   - **Use Case Similarities**: Common application scenarios
   - **Interoperability Notes**: How the specifications can work together

## Technologies

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Lucide React (icons)
- OpenAI GPT-4 (comparison analysis)
- Mermaid (diagram rendering)

## Project Structure

```
src/
├── components/        # UI components
│   ├── ComparisonView.tsx    # NEW: Comparison interface
│   ├── DiagramViewer.tsx
│   ├── ExampleViewer.tsx
│   ├── SchemaViewer.tsx
│   └── TermsList.tsx
├── services/         # Business logic
│   └── comparisonService.ts  # NEW: OpenAI integration
├── data/            # Specification data
│   ├── specifications.ts
│   └── openapi.yaml
├── types/           # TypeScript types
│   └── specification.ts
└── App.tsx          # Main application
```

## Notes

- The comparison feature requires an OpenAI API key
- Comparisons use GPT-4 Turbo for detailed technical analysis
- API calls are made client-side (ensure your API key has appropriate rate limits)
- All specification data is embedded in the application for offline browsing
