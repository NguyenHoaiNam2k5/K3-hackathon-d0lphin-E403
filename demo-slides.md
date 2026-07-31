# VLearn Socratic Tutor — Final Demo Slides

## Slide 1 — Problem

Learners reviewing dense lecture slides need fast, grounded help. A generic chatbot answer is risky because learners cannot easily verify whether the explanation came from the lecture transcript.

## Slide 2 — Solution

VLearn Socratic Tutor combines:

- React/Vite lesson review UI.
- Flask AI agent backend.
- Transcript retrieval with paragraph citations.
- Marked-text explanation and quiz generation.

## Slide 3 — Demo Flow

1. Open the Day 4 slide deck in the VLearn UI.
2. Ask a question about the current slide.
3. Click citation buttons to inspect transcript chunks.
4. Select text on a slide and ask for an explanation.
5. Generate a slide quiz and complete it.
6. Show partial/insufficient evidence behavior when requested content is unsupported.

## Slide 4 — Architecture

React/Vite UI (`codebase/`) calls Flask APIs (`codebase/backend/`):

- `/api/chat`
- `/api/marked-text`
- `/api/quiz`
- `/api/version`

The backend keeps API keys server-side, retrieves transcript chunks, calls the provider, validates citations, and returns grounded output.

## Slide 5 — Evaluation

Current evidence:

- Marked-text benchmark: 24/24 pass.
- Quiz API tests: ready, partial, insufficient evidence, invalid citation rejection, bracket citation normalization.
- API-only smoke: `/api/version` works; `/` returns `404`.
- Frontend build: `npm run build` passes.

## Slide 6 — Feedback and Iteration

Named feedback drove concrete changes:

- Removed old Flask UI.
- Rendered Markdown in chat answers.
- Updated README run/API docs.
- Added strict quiz validation.
- Synced slide suggestions to the real 43-page Day 4 deck.

Dry run passed for backend API, frontend build, Slide 4 suggestions, and backend validation tests.
