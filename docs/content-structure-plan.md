# CallWaitingAI Landing Page - Content Structure Plan

## Website Type
**Single Page Application (SPA)** with smooth scrolling sections and anchor navigation

## Brand Assets
- Logo: `/workspace/user_input_files/callwaiting ai logo.jpeg`
- Brand Colors: Purple (#8B5CF6), Blue (#3B82F6), Cyan (#06B6D4), Green (#10B981)
- Voice Model: Marcy (moss_audio_fdad4786-ab84-11f0-a816-023f15327f7a) - American female

## Page Structure

### Section 1: Navigation (Fixed Header)
**Component Type**: Fixed Navigation Bar
**Content**:
- Logo (left)
- Navigation links: Features, How It Works, Pricing
- Auth buttons: Sign In, Get Started Free (CTA)

### Section 2: Hero Section
**Component Type**: Full-screen Hero with CTA
**Content**:
- Headline: "AI-Powered Voice Receptionist"
- Subheading: "Never miss a paying call again"
- Description: "AI voice receptionist that answers, qualifies, and books calls for your business 24/7. Built for UK businesses that value every customer."
- Primary CTA: "Talk to Our AI - Free Demo"
- Secondary CTA: "Get Started Free"
- Contact: "+1 (276) 582-5329"
- Trust badges: "100 free calls", "Setup in 5 minutes", "24/7 Always Available", "98% Accuracy Rate"

### Section 3: Features Section
**Component Type**: Feature Grid (3x2 layout)
**Content**: 6 feature cards
1. 24/7 Call Handling
2. Smart AI Responses
3. Lead Qualification
4. Real-Time Analytics
5. Instant Setup
6. UK Data Security

### Section 4: Visualization Section
**Component Type**: Visual Demo Cards (2x2 grid)
**Content**: 4 visualization cards showing AI in action
1. Call Reception
2. Conversation Flow
3. Lead Qualification
4. Team Notification

### Section 5: How It Works Section
**Component Type**: Step-by-step Process Flow
**Content**: 4-step workflow visualization
1. Incoming Call
2. Real-Time Transcription
3. AI Processing
4. Voice Response

### Section 6: Pricing Section
**Component Type**: Pricing Cards (3 tiers)
**Content**:
- Starter: 100 free calls
- Professional: $49.99/month
- Enterprise: Custom pricing

### Section 7: Footer
**Component Type**: Multi-column Footer
**Content**:
- Product links
- Company links
- Legal links
- Copyright notice

### Section 8: Floating Chat Widget
**Component Type**: Fixed Bottom-right Widget
**Content**:
- Toggle button
- Chat interface
- Voice call button
- Integration with Marcy voice

## Data Sources
- Static content (no external data files needed)
- MiniMax TTS API for voice demo
- Integration with existing Supabase backend for sign-up

## Visual Assets
- Logo: user_input_files/callwaiting ai logo.jpeg
- Icons: SVG icon library (Lucide React)
- Gradients and patterns using CSS

## Fallback Strategy
- All content is static text (no fallbacks needed)
- Icons: Use Lucide React library
- Images: Use CSS gradients and SVG patterns
