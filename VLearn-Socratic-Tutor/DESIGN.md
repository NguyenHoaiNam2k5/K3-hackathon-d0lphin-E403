# VLearn UI Design Contract

## 1. Product Surface

VLearn is an operational learning dashboard: dense, dark, transcript-grounded, and optimized for a student reading slides while an AI tutor explains the marked concept.

## 2. Tokens

- Background: `slate-950`, `slate-900`, `indigo-950/40`
- Primary: `indigo-500`, `indigo-600`, `indigo-700`
- Accents: `cyan-400/500`, `emerald-400/500`, `amber-400/500`, `rose-400/500`
- Text: `white`, `slate-100`, `slate-200`, `slate-300`, `slate-400`, `slate-500`
- Type: Inter for body text, Outfit for headings, mono for citations and technical labels
- Radius: `rounded-lg`, `rounded-xl`, `rounded-2xl`
- Material: translucent slate glass with blur, thin borders, and restrained glow for active states

## 3. Layout

The student view is a two-column app shell: slide canvas on the left, tutor/chat/context panel on the right. Panels must remain scannable and avoid marketing-page spacing.

## 4. Interaction

Slide reading supports two paths:

- Click a known hotspot to show curated tutor guidance.
- Select or mark visible slide text to fetch transcript-grounded summary from the server.

Every active selection must show a loading state, success context with paragraph IDs, or an error state.

## 5. Components

- `glass-card`: primary translucent container with strong blur and visible border.
- `glass-panel`: secondary translucent panel with lighter blur.
- `chat-message`: assistant bubble with source/citation footer.
- `marked-text-control`: compact selection toolbar inside the slide canvas.

## 6. Accessibility

Interactive controls use real `button` elements when they trigger actions. Vietnamese text must wrap naturally inside cards and avoid clipping in small viewports.
