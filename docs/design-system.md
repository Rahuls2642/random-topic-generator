# Eloquent - Design System

A design system for a spontaneous speaking practice application that feels focused, intellectually stimulating, and premium.

## Design Philosophy

**Core Principles:**
- **Cognitive Focus**: Remove distractions, enhance concentration
- **Progressive Disclosure**: Show what's needed, when it's needed
- **Momentous Transitions**: Each state feels significant
- **Intellectual Aesthetic**: Scholarly but not academic, modern but not trendy
- **Performance Context**: Visual language that supports public speaking practice

---

## Color System

### Palette Strategy
Built around **focus states** and **cognitive modes** rather than brand emotions.

### Primitive Tokens

```css
/* Neutrals - Deep slate for focus */
--color-slate-950: #0a0e1a;
--color-slate-900: #0f1419;
--color-slate-800: #1a1f2e;
--color-slate-700: #2a3142;
--color-slate-600: #3d4557;
--color-slate-500: #6b7280;
--color-slate-400: #9ca3af;
--color-slate-300: #d1d5db;
--color-slate-200: #e5e7eb;
--color-slate-100: #f3f4f6;
--color-slate-50: #f9fafb;

/* Accent - Intellectual Blue (curiosity, learning) */
--color-blue-900: #0c1e3d;
--color-blue-800: #1e3a5f;
--color-blue-700: #1e40af;
--color-blue-600: #2563eb;
--color-blue-500: #3b82f6;
--color-blue-400: #60a5fa;
--color-blue-300: #93c5fd;

/* Success - Emerald (achievement, completion) */
--color-emerald-900: #064e3b;
--color-emerald-800: #065f46;
--color-emerald-700: #047857;
--color-emerald-600: #059669;
--color-emerald-500: #10b981;
--color-emerald-400: #34d399;

/* Recording - Crimson (active, live) */
--color-crimson-900: #450a0a;
--color-crimson-800: #7f1d1d;
--color-crimson-700: #991b1b;
--color-crimson-600: #dc2626;
--color-crimson-500: #ef4444;
--color-crimson-400: #f87171;

/* Attention - Amber (caution, time-sensitive) */
--color-amber-700: #b45309;
--color-amber-600: #d97706;
--color-amber-500: #f59e0b;
--color-amber-400: #fbbf24;

/* Violet - Premium, mastery */
--color-violet-800: #5b21b6;
--color-violet-700: #6d28d9;
--color-violet-600: #7c3aed;
--color-violet-500: #8b5cf6;
--color-violet-400: #a78bfa;
```

### Semantic Tokens

```css
/* Surfaces */
--surface-base: var(--color-slate-950);
--surface-elevated: var(--color-slate-900);
--surface-overlay: var(--color-slate-800);
--surface-interactive: var(--color-slate-700);

/* Text */
--text-primary: var(--color-slate-50);
--text-secondary: var(--color-slate-400);
--text-tertiary: var(--color-slate-500);
--text-disabled: var(--color-slate-600);
--text-inverse: var(--color-slate-950);

/* Borders */
--border-subtle: var(--color-slate-800);
--border-default: var(--color-slate-700);
--border-strong: var(--color-slate-600);

/* States */
--state-focus: var(--color-blue-500);
--state-success: var(--color-emerald-500);
--state-recording: var(--color-crimson-500);
--state-warning: var(--color-amber-500);
--state-premium: var(--color-violet-500);

/* Interactive */
--interactive-primary: var(--color-blue-600);
--interactive-primary-hover: var(--color-blue-500);
--interactive-primary-active: var(--color-blue-700);
--interactive-success: var(--color-emerald-600);
--interactive-success-hover: var(--color-emerald-500);
```

### Component Tokens

```css
/* Button - Primary */
--button-primary-bg: var(--interactive-primary);
--button-primary-bg-hover: var(--interactive-primary-hover);
--button-primary-text: var(--text-primary);

/* Button - Success */
--button-success-bg: var(--interactive-success);
--button-success-bg-hover: var(--interactive-success-hover);

/* Card */
--card-bg: var(--surface-elevated);
--card-border: var(--border-subtle);

/* Timer */
--timer-track: var(--border-default);
--timer-progress: var(--state-recording);
--timer-text: var(--text-primary);
```

---

## Typography

### Principles
- **Hierarchy through scale, not weight**
- **Generous line-height for readability**
- **Monospace for precision data (timers, stats)**
- **Variable fonts for performance**

### Font Stack

```css
/* Display & Headings - Inter Variable */
--font-display: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;

/* Body - Inter Variable */
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;

/* Monospace - JetBrains Mono (timers, stats, code) */
--font-mono: 'JetBrains Mono', 'SF Mono', 'Consolas', 'Liberation Mono', monospace;
```

### Scale (Major Third - 1.25 ratio)

```css
/* Display */
--text-display-2xl: 4.5rem;      /* 72px - Hero statements */
--text-display-xl: 3.75rem;      /* 60px - Page titles */
--text-display-lg: 3rem;         /* 48px - Section headers */

/* Headings */
--text-heading-xl: 2.25rem;      /* 36px - h1 */
--text-heading-lg: 1.875rem;     /* 30px - h2 */
--text-heading-md: 1.5rem;       /* 24px - h3 */
--text-heading-sm: 1.25rem;      /* 20px - h4 */

/* Body */
--text-body-xl: 1.25rem;         /* 20px - Large body */
--text-body-lg: 1.125rem;        /* 18px - Comfortable reading */
--text-body-base: 1rem;          /* 16px - Default */
--text-body-sm: 0.875rem;        /* 14px - Captions */
--text-body-xs: 0.75rem;         /* 12px - Metadata */

/* Mono (timers, stats) */
--text-mono-2xl: 4rem;           /* 64px - Large timer */
--text-mono-xl: 3rem;            /* 48px - Medium timer */
--text-mono-lg: 2rem;            /* 32px - Stats */
--text-mono-base: 1rem;          /* 16px - Labels */
```

### Weights

```css
--font-weight-light: 300;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
```

### Line Heights

```css
--leading-tight: 1.2;    /* Display text */
--leading-snug: 1.375;   /* Headings */
--leading-normal: 1.5;   /* Body text */
--leading-relaxed: 1.625;/* Comfortable reading */
--leading-loose: 1.75;   /* Research content */
```

---

## Spacing System

### Scale (4px base unit)

```css
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
--space-32: 8rem;     /* 128px */
```

### Layout Spacing (Semantic)

```css
--spacing-section: var(--space-24);
--spacing-component: var(--space-12);
--spacing-element: var(--space-6);
--spacing-inline: var(--space-4);
--spacing-compact: var(--space-2);
```

---

## Elevation & Depth

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
--shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.4);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.5);

/* Glows for interactive states */
--glow-blue: 0 0 20px rgba(59, 130, 246, 0.3);
--glow-emerald: 0 0 20px rgba(16, 185, 129, 0.3);
--glow-crimson: 0 0 20px rgba(239, 68, 68, 0.3);
```

### Z-Index Scale

```css
--z-base: 0;
--z-dropdown: 100;
--z-sticky: 200;
--z-overlay: 300;
--z-modal: 400;
--z-toast: 500;
```

---

## Border Radius

```css
--radius-sm: 0.375rem;   /* 6px */
--radius-base: 0.5rem;   /* 8px */
--radius-md: 0.75rem;    /* 12px */
--radius-lg: 1rem;       /* 16px */
--radius-xl: 1.5rem;     /* 24px */
--radius-2xl: 2rem;      /* 32px */
--radius-full: 9999px;   /* Pills, circles */
```

---

## Animation System

### Principles
- **Purposeful motion**: Every animation reinforces meaning
- **Respectful timing**: Fast enough to feel responsive, slow enough to follow
- **Reduced motion support**: Always provide fallbacks

### Timing Functions

```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Bouncy feel */
--ease-smooth: cubic-bezier(0.45, 0.05, 0.55, 0.95);
```

### Durations

```css
--duration-instant: 100ms;   /* Micro-interactions */
--duration-fast: 200ms;      /* Hovers, focus states */
--duration-base: 300ms;      /* Standard transitions */
--duration-slow: 500ms;      /* State changes */
--duration-deliberate: 700ms; /* Emphasis */
```

### Animation Patterns

```css
/* Fade in with slight scale */
@keyframes enter {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Slide up from bottom */
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pulse for recording indicator */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Progress ring */
@keyframes progress-ring {
  from {
    stroke-dashoffset: 301.59;
  }
  to {
    stroke-dashoffset: 0;
  }
}
```

---

## Component Patterns

### Button States

| State | Background | Text | Border | Shadow | Transform |
|-------|-----------|------|--------|---------|-----------|
| Default | `--button-primary-bg` | `--text-primary` | none | `--shadow-sm` | scale(1) |
| Hover | `--button-primary-bg-hover` | `--text-primary` | none | `--shadow-md` | scale(1.02) |
| Active | `--interactive-primary-active` | `--text-primary` | none | none | scale(0.98) |
| Focus | `--button-primary-bg` | `--text-primary` | 2px focus ring | `--shadow-sm` | scale(1) |
| Disabled | `--surface-interactive` | `--text-disabled` | none | none | scale(1) |

### Card States

| State | Background | Border | Shadow |
|-------|-----------|--------|---------|
| Default | `--card-bg` | `--card-border` | `--shadow-base` |
| Hover | `--surface-overlay` | `--border-default` | `--shadow-md` |
| Active | `--card-bg` | `--state-focus` | `--glow-blue` |

### Input States

| State | Background | Border | Text | Shadow |
|-------|-----------|--------|------|---------|
| Default | `--surface-elevated` | `--border-subtle` | `--text-primary` | none |
| Focus | `--surface-elevated` | `--state-focus` | `--text-primary` | `--glow-blue` |
| Error | `--surface-elevated` | `--state-recording` | `--text-primary` | `--glow-crimson` |
| Disabled | `--surface-base` | `--border-subtle` | `--text-disabled` | none |

---

## Layout Principles

### 1. **Center-Stage Focus**
- Main content always centered
- Max width: 42rem (672px) for optimal reading
- Full-width for immersive states (recording, timer)

### 2. **Vertical Rhythm**
- Consistent spacing between sections
- Use `--spacing-section` (6rem) between major blocks
- Use `--spacing-component` (3rem) between related elements

### 3. **Responsive Breakpoints**

```css
--breakpoint-sm: 640px;   /* Mobile landscape */
--breakpoint-md: 768px;   /* Tablet portrait */
--breakpoint-lg: 1024px;  /* Tablet landscape / small desktop */
--breakpoint-xl: 1280px;  /* Desktop */
--breakpoint-2xl: 1536px; /* Large desktop */
```

### 4. **Safe Areas**
- Minimum padding: `var(--space-6)` (1.5rem / 24px)
- On mobile: `var(--space-4)` (1rem / 16px)

---

## Iconography

### System
- **Library**: Lucide React (consistent, minimal, open-source)
- **Size Scale**: 16px, 20px, 24px, 32px, 48px
- **Stroke Width**: 2px (default), 1.5px (large icons)
- **Color**: Always inherit or use semantic tokens

### Icon Usage

```jsx
// Default state icon
<Icon size={20} strokeWidth={2} className="text-slate-400" />

// Active/emphasized icon
<Icon size={24} strokeWidth={2} className="text-blue-400" />

// Large display icon
<Icon size={48} strokeWidth={1.5} className="text-emerald-400" />
```

### Key Icons

| Context | Icon | Purpose |
|---------|------|---------|
| Topic generation | `Brain`, `Sparkles` | Intellectual curiosity |
| Research | `BookOpen`, `Search` | Learning mode |
| Recording | `Mic`, `Video` | Live capture |
| Timer | `Clock`, `Timer` | Time tracking |
| Success | `CheckCircle`, `Trophy` | Achievement |
| Analysis | `BarChart`, `TrendingUp` | Performance |
| Navigation | `ChevronRight`, `ArrowRight` | Progression |

---

## Accessibility

### Color Contrast
- **Text on background**: Minimum 4.5:1 (WCAG AA)
- **Large text (18px+)**: Minimum 3:1
- **Interactive elements**: Minimum 3:1

### Focus Management
- Always visible focus ring: 2px solid `--state-focus`
- Offset: 2px
- Skip to main content link for keyboard users

### Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Screen Readers
- Semantic HTML first
- ARIA labels for icon-only buttons
- Live regions for timer updates
- Status announcements for state changes

---

## Gamification Elements

### Progress Indicators
- **Subtle**: No XP bars or badges
- **Meaningful**: Track speaking time, topics covered, improvement trends
- **Visual**: Use data visualization (line charts, heat maps)

### Achievements
- **Milestone-based**: 10 topics, 1 hour total, 5-day streak
- **Visual language**: Subtle badges with `--state-premium` violet accent
- **Non-intrusive**: Show in history/progress screen only

### Feedback
- **Immediate**: Visual confirmation of actions
- **Constructive**: AI feedback focuses on growth
- **Celebratory**: Success states use `--state-success` with gentle animations

---

## State-Specific Treatments

### Landing State
- Large typography
- Generous spacing
- Subtle gradient on headline
- Clear single CTA

### Generating State
- Loading spinner with `--state-focus` color
- Animated pulse
- Minimal text

### Topic Reveal
- Topic title: `--text-heading-xl` (36px)
- Card with accent border
- Smooth slide-up animation
- Category pills with semantic colors

### Research State
- Reading-optimized spacing
- `--leading-relaxed` line-height
- Checklist items with subtle bullets
- No time pressure indicators

### Recording State
- Full-screen treatment
- Large monospace timer (`--text-mono-2xl`)
- Circular progress indicator
- Pulsing recording dot
- Minimal UI to reduce distraction

### Results State
- Data-driven layout
- Charts and metrics
- Feedback sections with clear hierarchy
- Prominent "Next Topic" CTA

---

## Design Tokens Export

Generate CSS variables:

```css
:root {
  /* Colors */
  --color-slate-950: #0a0e1a;
  /* ... (all tokens above) */
  
  /* Typography */
  --font-display: 'Inter', sans-serif;
  /* ... */
  
  /* Spacing */
  --space-1: 0.25rem;
  /* ... */
  
  /* Animation */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  /* ... */
}
```

---

## Implementation Notes

1. **CSS Variables**: Use for runtime theme switching
2. **Tailwind Integration**: Map tokens to Tailwind config
3. **Component Library**: Build reusable React components with these specs
4. **Dark Mode**: Already designed for dark-first (light mode is optional future work)
5. **Performance**: Use CSS containment, will-change sparingly

---

**Next Steps:**
1. Generate `assets/design-tokens.css`
2. Update Tailwind config with custom tokens
3. Build component library (Button, Card, Timer, etc.)
4. Design screen-specific layouts
