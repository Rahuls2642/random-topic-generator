# UX Architecture - Eloquent

User experience flow and screen specifications for the spontaneous speaking practice app.

---

## User Journey Map

```
Landing → Generate → Research → Record → Analysis → History
   ↓         ↓          ↓          ↓         ↓         ↓
  CTA    Loading    Study      Live       Review    Progress
         State      Mode      Session    Results   Tracking
```

---

## State Machine

```typescript
type AppState = 
  | 'landing'        // Entry point
  | 'generating'     // AI generating topic
  | 'topic_reveal'   // Topic displayed, user can research
  | 'recording'      // Active speaking session
  | 'analysis'       // AI analyzing performance
  | 'results'        // Performance feedback
  | 'history'        // Past sessions

type Transition =
  | { from: 'landing', to: 'generating', trigger: 'user_clicks_generate' }
  | { from: 'generating', to: 'topic_reveal', trigger: 'topic_loaded' }
  | { from: 'topic_reveal', to: 'recording', trigger: 'user_starts_recording' }
  | { from: 'recording', to: 'analysis', trigger: 'recording_complete' }
  | { from: 'analysis', to: 'results', trigger: 'analysis_complete' }
  | { from: 'results', to: 'generating', trigger: 'user_requests_new_topic' }
  | { from: 'results', to: 'history', trigger: 'user_views_history' }
```

---

## Screen Specifications

### 1. Landing Screen

**Purpose:** Welcome users and set expectations

**Layout:**
```
┌─────────────────────────────────────────┐
│                                         │
│              [Brain Icon]               │
│                                         │
│        Think. Research. Speak.          │
│                                         │
│   Get a random topic. Learn something   │
│   new. Speak for one minute.            │
│                                         │
│         [Generate Topic →]              │
│                                         │
│    ✓ Discover    ✓ Practice speaking   │
│    ✓ Improve     ✓ Build knowledge     │
│                                         │
└─────────────────────────────────────────┘
```

**Components:**
- Hero icon (Brain) - 64px, blue-400, in circular badge with glow
- Headline - `text-display-xl`, gradient from blue-400 to emerald-400
- Subheadline - `text-body-xl`, slate-400
- Primary CTA button - Full-width on mobile, auto on desktop
- Feature grid - 2x2, subtle icons, slate-500 text

**Interactions:**
- Button hover: Scale 1.02, shadow-md, blue-500 bg
- Button click: Scale 0.98, navigate to generating state
- Scroll reveal: Fade in features with stagger

**Key Metrics:**
- Time to first click
- Conversion rate (landing → generating)

---

### 2. Generating State

**Purpose:** Provide feedback while AI generates topic

**Layout:**
```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│                                         │
│             [Spinner]                   │
│                                         │
│      Discovering a new topic...         │
│                                         │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

**Components:**
- Loading spinner - 64px, border-4, blue-500, animate-spin
- Status text - `text-body-lg`, slate-400

**Interactions:**
- Spinner rotates continuously
- Auto-transition to topic_reveal when loaded
- No user interaction during this state

**Duration:** 1-3 seconds (simulated delay for anticipation)

---

### 3. Topic Reveal & Research Screen

**Purpose:** Present topic and allow unlimited research time

**Layout:**
```
┌─────────────────────────────────────────┐
│                                         │
│      [History] [Psychology] [Medium]    │
│                                         │
│    The Great Molasses Flood of 1919     │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ A massive industrial accident in  │  │
│  │ Boston in which a storage tank    │  │
│  │ burst and released a wave of      │  │
│  │ molasses through the city.        │  │
│  │                                   │  │
│  │ 📚 Things to research             │  │
│  │  • What happened?                 │  │
│  │  • Why did the tank fail?         │  │
│  │  • What were the consequences?    │  │
│  │  • What changed afterward?        │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Take your time to research. No timer.  │
│                                         │
│      [🎤 Start 1-Minute Challenge]      │
│                                         │
└─────────────────────────────────────────┘
```

**Components:**
- Metadata pills - Category, subcategory, difficulty
  - Pills: `border-radius: full`, `padding: 0.5rem 1rem`
  - Difficulty colors: Easy (emerald), Medium (amber), Hard (crimson)
- Topic title - `text-heading-xl`, white, centered
- Content card - `card-bg`, `border-subtle`, left accent border (blue-500)
- Description - `text-body-lg`, slate-300, `line-height: relaxed`
- Research checklist - Bullet points, slate-400, BookOpen icon
- Reassurance text - `text-body-base`, slate-500
- Primary CTA - Success color (emerald), Mic icon

**Interactions:**
- Card hover: Subtle lift (shadow-md)
- Checklist items: Checkable (optional feature)
- CTA hover: Scale 1.02, emerald-500 bg
- CTA click: Request microphone/camera permissions → Recording state

**Accessibility:**
- Checklist items are `<ul>` with proper semantics
- CTA has aria-label "Start speaking challenge"

---

### 4. Recording Screen

**Purpose:** Immersive recording experience with minimal distractions

**Layout:**
```
┌─────────────────────────────────────────┐
│                                         │
│         Explain                         │
│  The Great Molasses Flood of 1919       │
│                                         │
│                                         │
│            ╭─────────╮                  │
│           │           │                 │
│           │   00:45   │                 │
│           │           │                 │
│           │ 🔴 Recording                │
│            ╰─────────╯                  │
│                                         │
│                                         │
│         [⬛ Stop Early]                  │
│                                         │
└─────────────────────────────────────────┘
```

**Components:**
- Context label - `text-body-sm`, uppercase, slate-500, centered
- Topic reminder - `text-heading-lg`, slate-200, centered
- Timer circle - 256px diameter, centered
  - Outer ring: Progress indicator (crimson-500)
  - Inner content: Monospace time display (`text-mono-2xl`)
  - Recording indicator: Pulsing red dot + "Recording" label
- Stop button - Ghost style, slate-800 bg, Square icon

**Interactions:**
- Timer counts down from 60 seconds
- Progress ring animates (stroke-dashoffset)
- Recording dot pulses (animate-pulse)
- Stop button: Ends recording early
- Auto-stop at 00:00

**States:**
- Recording active (0-60s)
- Final 10 seconds: Timer text turns amber-400
- Final 5 seconds: Timer text turns crimson-400

**Accessibility:**
- Timer updates announced to screen readers every 10 seconds
- Live region for timer aria-live="polite"
- Clear visual indicators for recording state

---

### 5. Analysis State

**Purpose:** Provide feedback while AI analyzes performance

**Layout:**
```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│                                         │
│          [Animated Wave Form]           │
│                                         │
│      Analyzing your presentation...     │
│                                         │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

**Components:**
- Waveform animation - Audio visualization (optional)
- Status text - `text-body-lg`, slate-400

**Duration:** 3-5 seconds (AI processing time)

**Future Enhancement:** Show real-time processing steps
- "Transcribing speech..."
- "Analyzing clarity..."
- "Evaluating structure..."

---

### 6. Results Screen

**Purpose:** Provide actionable feedback and celebration

**Layout:**
```
┌─────────────────────────────────────────┐
│             ✓ Complete!                 │
│                                         │
│    You explained:                       │
│  The Great Molasses Flood of 1919       │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ Your Recording          00:58     │  │
│  │ [Audio Player Controls]           │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 📊 Performance Overview           │  │
│  │                                   │  │
│  │  Clarity            ████████░░ 8/10│
│  │  Structure          ███████░░░ 7/10│
│  │  Confidence         █████████░ 9/10│
│  │  Pacing             ██████░░░░ 6/10│
│  │                                   │  │
│  │ 💡 Key Insights                   │  │
│  │  • Strong opening                 │  │
│  │  • Could use more examples        │  │
│  │  • Good time management           │  │
│  └───────────────────────────────────┘  │
│                                         │
│       [🔄 Generate Another Topic]       │
│            [📊 View History]            │
│                                         │
└─────────────────────────────────────────┘
```

**Components:**
- Success icon - CheckCircle, emerald-400, 48px
- Completion message - `text-heading-md`, white
- Topic reference - `text-body-lg`, slate-400
- Audio playback card
  - Native `<audio>` element styled
  - Duration display
- Performance metrics card
  - Progress bars for each dimension
  - Color-coded: 0-4 (crimson), 5-7 (amber), 8-10 (emerald)
  - Icons for each metric
- Insights list
  - Bullet points with lightbulb icon
  - Slate-300 text
- CTAs
  - Primary: Generate another (blue-600)
  - Secondary: View history (slate-700)

**Interactions:**
- Audio player: Standard browser controls
- Metrics: Animate on reveal (progress bars fill)
- CTAs: Standard button hover/click

**Future Enhancements:**
- Detailed transcript with timestamps
- Speech patterns visualization
- Comparison with previous attempts
- Share results (social/download)

---

### 7. History Screen

**Purpose:** Track progress and review past sessions

**Layout:**
```
┌─────────────────────────────────────────┐
│  ← Back        Your Progress            │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  📈 Stats                       │   │
│  │  • 12 topics completed          │   │
│  │  • 11m 48s total speaking time  │   │
│  │  • 5-day streak                 │   │
│  │  • Avg score: 7.8/10            │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Recent Sessions                        │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ The Fermi Paradox               │   │
│  │ Oct 1 • 00:58 • Score: 8.2      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ How GPS Works                   │   │
│  │ Sep 30 • 00:60 • Score: 7.5     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ The Placebo Effect              │   │
│  │ Sep 29 • 00:45 • Score: 6.9     │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Components:**
- Header - Back button, page title
- Stats card
  - Trophy icon
  - Key metrics in grid layout
  - Violet-500 accent for premium feel
- Session list
  - Cards with topic, date, duration, score
  - Click to expand full results
  - Chronological order (newest first)

**Interactions:**
- Back button: Returns to results or landing
- Session card hover: Lift effect
- Session card click: Expand to show full feedback
- Infinite scroll or pagination for many sessions

**Future Enhancements:**
- Progress charts over time
- Filter by category/difficulty
- Export data
- Achievements/badges

---

## Responsive Behavior

### Mobile (< 640px)
- Single column layout
- Full-width CTAs
- Larger touch targets (min 44px)
- Reduce font sizes by 1 step
- Stack feature grid vertically
- Simplified timer display

### Tablet (640px - 1024px)
- Max width: 42rem (672px), centered
- Standard spacing
- Two-column feature grid
- Full desktop experience

### Desktop (> 1024px)
- Max width: 42rem (672px), centered
- Enhanced hover effects
- Keyboard shortcuts enabled
- Larger display typography

---

## Microinteractions

### Button Clicks
```css
.button:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-md);
  transition: all var(--duration-fast) var(--ease-out);
}

.button:active {
  transform: scale(0.98);
  transition: all var(--duration-instant) var(--ease-in);
}
```

### Card Reveals
- Stagger animation: 100ms delay between cards
- Slide up + fade in
- Duration: 300ms

### Loading States
- Skeleton screens for content
- Spinner for actions
- Progress indicators for known durations

### Success Celebrations
- Confetti animation (optional)
- Success icon bounce
- Gentle scale + fade in

---

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `Space` | Start/stop recording |
| `Enter` | Confirm primary action |
| `Esc` | Cancel/go back |
| `Tab` | Navigate focusable elements |
| `?` | Show keyboard shortcuts (future) |

---

## Error States

### Microphone Permission Denied
```
┌─────────────────────────────────────────┐
│          🎤 Microphone Needed           │
│                                         │
│  This app requires microphone access    │
│  to record your speaking practice.      │
│                                         │
│     [Grant Permission] [Go Back]        │
└─────────────────────────────────────────┘
```

### Camera Permission Denied (Future)
- Similar pattern to microphone

### Network Error (Topic Generation Failed)
```
┌─────────────────────────────────────────┐
│           ⚠️ Couldn't Load Topic        │
│                                         │
│  Check your connection and try again.   │
│                                         │
│         [Try Again] [Go Back]           │
└─────────────────────────────────────────┘
```

### Analysis Failed
- Fallback: Show recording without AI feedback
- Allow user to retry or continue

---

## Performance Targets

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1
- **First Input Delay:** < 100ms

**Optimization Strategies:**
- Code splitting by route
- Lazy load heavy components
- Optimize images (WebP)
- Preload fonts
- Cache design tokens

---

## Accessibility Checklist

- ✅ Semantic HTML structure
- ✅ ARIA labels on all interactive elements
- ✅ Keyboard navigation support
- ✅ Focus visible styles
- ✅ Color contrast WCAG AA compliant
- ✅ Reduced motion support
- ✅ Screen reader announcements for state changes
- ✅ Alt text for images/icons
- ✅ Skip to main content link
- ✅ Form labels and error messages

---

## Future Features

### Phase 2
- Camera recording (facial expressions)
- Video playback with transcript overlay
- Share results to social media
- Downloadable certificate/badge

### Phase 3
- Multi-language support
- Custom topic selection
- Team mode (compete with friends)
- Advanced analytics dashboard

### Phase 4
- AI coaching (real-time feedback)
- Voice modulation analysis
- Presentation tips during research phase
- Integration with learning platforms

---

## Design System Integration

All screens use tokens from `design-tokens.css`:

```jsx
// Example component
<div className="bg-[var(--surface-elevated)] border-[var(--border-subtle)] rounded-lg p-6">
  <h2 className="text-heading-xl font-bold">
    Topic Title
  </h2>
</div>
```

Or with Tailwind (after config update):

```jsx
<div className="bg-slate-900 border-slate-800 rounded-lg p-6">
  <h2 className="text-heading-xl font-bold">
    Topic Title
  </h2>
</div>
```

---

**Status:** Architecture complete. Ready for implementation.

**Next Steps:**
1. Build reusable component library
2. Implement each screen
3. Add animations and transitions
4. Test accessibility
5. Optimize performance
