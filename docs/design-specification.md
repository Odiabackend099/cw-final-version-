# CallWaitingAI Landing Page - Design Specification

## Design Direction
**Contemporary Elegance with Tech Innovation**

A refined, modern aesthetic that conveys trust, professionalism, and cutting-edge AI technology. The design balances sophistication with approachability, using the brand's vibrant gradient colors to create visual interest while maintaining a clean, conversion-focused layout.

### Design Philosophy
- **Visual Hierarchy**: Clear focal points guide users from hero → features → action
- **Tech-Forward**: Circuit patterns and gradients reflect AI innovation
- **Trustworthy**: Professional typography and generous whitespace convey reliability
- **Conversion-Optimized**: Strategic CTA placement throughout the journey

## Design Tokens

### Colors
```
Primary Gradient: purple-600 → blue-500 → cyan-500 → green-500
- Primary Purple: #8B5CF6
- Primary Blue: #3B82F6
- Primary Cyan: #06B6D4
- Primary Green: #10B981

Neutrals:
- Background: #FFFFFF
- Surface: #F9FAFB
- Border: #E5E7EB
- Text Primary: #111827
- Text Secondary: #6B7280

Accent:
- Success: #10B981
- Warning: #F59E0B
- Error: #EF4444
```

### Typography
```
Font Family: 
- Headings: 'Inter', system-ui, sans-serif (weight: 700-900)
- Body: 'Inter', system-ui, sans-serif (weight: 400-600)

Scale:
- Hero: 3.5rem / 4rem (mobile: 2.5rem)
- H1: 2.5rem / 3rem (mobile: 2rem)
- H2: 2rem / 2.5rem (mobile: 1.75rem)
- H3: 1.5rem / 2rem (mobile: 1.25rem)
- Body: 1rem / 1.5rem
- Small: 0.875rem / 1.25rem

Line Height: 1.5 (body), 1.2 (headings)
```

### Spacing
```
Base unit: 4px (0.25rem)

Scale:
- xs: 0.5rem (8px)
- sm: 0.75rem (12px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)
- 3xl: 4rem (64px)
- 4xl: 6rem (96px)

Section Padding: 
- Mobile: py-12 (3rem)
- Desktop: py-20 (5rem)
```

### Border Radius
```
- sm: 0.375rem (6px)
- md: 0.5rem (8px)
- lg: 0.75rem (12px)
- xl: 1rem (16px)
- 2xl: 1.5rem (24px)
- full: 9999px
```

### Shadows
```
- sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
- md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
- lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
- xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)
- 2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25)
```

### Animation
```
Duration: 
- Fast: 150ms
- Normal: 300ms
- Slow: 500ms

Easing: cubic-bezier(0.4, 0, 0.2, 1)

Effects:
- Hover: scale(1.02) + shadow increase
- Button press: scale(0.98)
- Fade in: opacity 0 → 1
- Slide up: translateY(20px) → translateY(0)
```

## Component Specifications

### Navigation Bar
```
- Height: 4rem (64px)
- Background: white with backdrop-blur
- Border: bottom border-gray-200
- Logo: 2rem height
- Links: text-sm font-medium text-gray-700 hover:text-purple-600
- CTA Button: gradient background, rounded-full, px-6 py-2.5
- Fixed position with shadow on scroll
```

### Hero Section
```
- Height: 100vh (mobile: auto)
- Background: gradient from purple-50 to white
- Pattern: subtle circuit board pattern (opacity 0.05)
- Headline: text-5xl font-bold gradient text
- Subheadline: text-xl text-gray-600
- CTA Buttons: 
  - Primary: gradient bg-gradient-to-r from-purple-600 to-blue-500
  - Secondary: border-2 border-purple-600 text-purple-600
- Trust Badges: grid-cols-4 with icons
```

### Feature Card
```
- Background: white
- Border: border border-gray-200
- Radius: rounded-2xl
- Padding: p-8
- Shadow: hover:shadow-xl transition
- Icon: 3rem size with gradient background
- Title: text-xl font-semibold
- Description: text-gray-600
- Hover: translateY(-4px) + shadow increase
```

### Visualization Card
```
- Background: gradient from purple-50 to cyan-50
- Border: border-2 border-purple-200
- Radius: rounded-3xl
- Padding: p-10
- Icon: 4rem with animation
- Label: text-lg font-semibold
- Animation: pulse effect on icon
```

### How It Works Step
```
- Layout: horizontal flow with connector lines
- Step Circle: w-16 h-16 rounded-full gradient bg
- Step Number: text-2xl font-bold white
- Step Title: text-xl font-semibold
- Description: text-gray-600
- Connector: gradient line between steps
- Mobile: vertical stack
```

### Pricing Card
```
- Background: white (featured: gradient border)
- Border: border-2 border-gray-200
- Radius: rounded-3xl
- Padding: p-8
- Featured: scale(1.05) + gradient border
- Price: text-5xl font-bold
- Features: list with checkmark icons
- CTA: full-width button
```

### Button Styles
```
Primary:
- bg-gradient-to-r from-purple-600 to-blue-500
- text-white font-semibold
- px-8 py-4 rounded-full
- hover:shadow-xl hover:scale-105

Secondary:
- border-2 border-purple-600
- text-purple-600 font-semibold
- px-8 py-4 rounded-full
- hover:bg-purple-50

Text Button:
- text-purple-600 font-medium
- underline-offset-4 hover:underline
```

### Floating Chat Widget
```
- Position: fixed bottom-6 right-6
- Size: w-16 h-16 (expanded: w-96 h-[32rem])
- Background: gradient from purple-600 to blue-500
- Border: rounded-full (expanded: rounded-2xl)
- Shadow: shadow-2xl
- Animation: slide-up on open
- Icons: chat and microphone
```

## Layout Patterns

### Container
```
- Max width: 1280px
- Padding: px-6 (mobile), px-8 (desktop)
- Margin: mx-auto
```

### Grid Layouts
```
Features Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
Pricing Grid: grid-cols-1 md:grid-cols-3 gap-8
Trust Badges: grid-cols-2 md:grid-cols-4 gap-6
```

### Responsive Breakpoints
```
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
```

## Interaction Standards

### Hover States
- All interactive elements have hover states
- Buttons: scale + shadow increase
- Cards: translateY + shadow increase
- Links: color change + underline

### Focus States
- Visible focus rings (ring-2 ring-purple-500 ring-offset-2)
- Keyboard navigation support

### Loading States
- Skeleton loaders for async content
- Spinner for button actions

### Scroll Behavior
- Smooth scroll to sections
- Sticky navigation with shadow on scroll
- Fade-in animations on scroll into view

## Accessibility
- WCAG 2.1 AA compliant
- Semantic HTML elements
- ARIA labels for icons
- Keyboard navigation
- Screen reader support
- Color contrast ratios: 4.5:1 minimum
