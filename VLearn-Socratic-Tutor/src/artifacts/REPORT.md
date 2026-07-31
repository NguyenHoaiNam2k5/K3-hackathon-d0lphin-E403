# VLearn Socratic Tutor — Report

## A. Demo Summary

VLearn Socratic Tutor is a transcript-grounded lesson review prototype. The React/Vite UI in `../codebase` lets a learner review a slide deck, ask the AI tutor about the current slide, inspect transcript citations, explain selected slide text, and generate a short quiz. The Flask backend in `VLearn-Socratic-Tutor/` stays API-only and keeps provider keys server-side.

Current run surface:

- Backend: `DAY04_ENV_FILE=.env PYTHONIOENCODING=utf-8 python src/app.py` on `http://localhost:8501`
- Frontend: `npm run dev` from `../codebase` on `http://localhost:3000`
- Vite proxy: `/api/*` -> `http://localhost:8501/api/*`

## B. AI Decision and Evidence

Central AI decision: decide whether the retrieved transcript chunks are sufficient to answer, explain marked text, or generate quiz questions. The system must cite transcript paragraph ids and must refuse or return partial output when evidence is insufficient.

Implemented API endpoints:

| Endpoint | Role in demo |
|---|---|
| `GET /api/version` | Shows artifact/data-pack status. |
| `GET /api/data-pack` | Shows transcript, slide, and chatlog metadata. |
| `POST /api/chat` | Transcript-grounded chat answer with citations. |
| `POST /api/marked-text` | Explanation for selected slide text from retrieved transcript chunks. |
| `POST /api/quiz` | Validated quiz generation from transcript context. |

Guardrails used by `/api/quiz`:

- Reject quiz items with empty citations.
- Reject quiz items whose citation is not in the retrieved chunks.
- Reject quiz items whose option count is not exactly 4.
- Reject quiz items whose `correct_option_index` is outside `0..3`.
- Return `PARTIAL` or `INSUFFICIENT_EVIDENCE` instead of filling missing questions with unsupported content.

## C. Evaluation Results

| Run | Time | Command | Result | Artifact |
|---|---|---|---|---|
| Marked-text eval 01 | 2026-07-30 17:03 ICT | `DAY04_ENV_FILE=.env PYTHONIOENCODING=utf-8 python eval/run_marked_text_eval.py` | 24/24 pass | `eval/runs/vlearn_marked_text_grounding_v1_2026-07-30T100300Z0000.json` |
| Marked-text eval 02 | 2026-07-30 21:20 ICT | `DAY04_ENV_FILE=.env PYTHONIOENCODING=utf-8 python eval/run_marked_text_eval.py` | 24/24 pass | `eval/runs/vlearn_marked_text_grounding_v1_2026-07-30T142010Z0000.json` |
| Latest rerun after `.env` update | 2026-07-30 21:54 ICT | `DAY04_ENV_FILE=.env PYTHONIOENCODING=utf-8 python eval/run_marked_text_eval.py` | 24/24 pass | `eval/runs/vlearn_marked_text_grounding_v1_2026-07-30T145404Z0000.json` |

Notes:

- Current benchmark is `vlearn_marked_text_grounding_v1`.
- `Pass rate case chatlog` remains `N/A` until golden-set cases include `origin = chatlog_mining` metadata.
- Focused backend tests for quiz validation passed: `python -m pytest tests/test_quiz_api.py tests/test_transcript_retrieval.py -q` -> `9 passed`.

## D. Feedback Log

| ID | Người góp ý | Vai trò | Feedback / quote | Thay đổi hoặc quyết định |
|---|---|---|---|---|
| F01 | Trần Anh Văn — 2A202601513 | Code | Flask backend không nên giữ UI cũ khi React/Vite đã là UI chính. | Removed Flask `/` render route, disabled static serving, deleted `src/templates/index.html`. Backend is API-only. |
| F02 | Lường Duy Thái — 2A202601021 | UI | Chat answer hiển thị Markdown thô như `**...**` và `---`, nhìn khó đọc. | Added `react-markdown` + `remark-gfm`; assistant answers now render bold, lists, rules, and code blocks. |
| F03 | Nguyễn Hoài Nam — 2A202601399 | Spec/Product | Phần README/run instructions còn lẫn lab cũ và Streamlit, dễ chạy sai surface. | Updated `VLearn-Socratic-Tutor/README.md`: backend `8501`, npm UI `3000`, route table, request examples. |
| F04 | Ngô Hoàng Gia Bảo — 2A202601375 | Golden set / Eval | Quiz item không được render nếu thiếu citation, citation sai chunk, không đủ 4 lựa chọn, hoặc đáp án invalid. | Added `/api/quiz` validation tests and server-side rejection logic in `quiz_service.py`. |
| F05 | Nguyễn Hoài Nam — 2A202601399 | Validation/Demo | “Gợi ý theo slide” không đúng nội dung slide đang xem; Slide 4 còn hiện câu hỏi về Augmentation. | Synced `codebase/src/data/slidesData.js` to the real 43-page Day 4 PDF; Slide 4 now suggests prompt/tool-calling questions. |
| F06 | Trần Anh Văn — 2A202601513 | Code | Eval run JSON and validation output should not clutter git status. | Updated root `.gitignore` and `VLearn-Socratic-Tutor/.gitignore` to ignore `eval/runs/` and `validation/`. |

## E. Changelog

| Date | Change | Evidence |
|---|---|---|
| 2026-07-30 | Integrated React/Vite UI with Flask AI backend. | `codebase/vite.config.js`, `codebase/src/services/aiAgentService.js`, Flask `/api/*` routes. |
| 2026-07-30 | Added transcript-grounded `/api/quiz`. | `src/services/quiz_service.py`, `tests/test_quiz_api.py`. |
| 2026-07-30 | Removed obsolete Flask-rendered UI. | `/` returns `404`; URL map contains only `/api/chat`, `/api/data-pack`, `/api/marked-text`, `/api/quiz`, `/api/version`. |
| 2026-07-30 | Rendered AI chat answers as Markdown. | `ChatPanel.jsx` uses `ReactMarkdown`; build passed. |
| 2026-07-30 | Replaced stale 6-slide mock metadata with 43 Day 4 slide entries. | `slides.length = 43`; Slide 4 title is `Mục Tiêu Ngày 4`. |
| 2026-07-30 | Updated backend README for current run/API contract. | `VLearn-Socratic-Tutor/README.md` route list matches `src/app.py`. |
| 2026-07-30 | Ignored generated eval and validation outputs. | `.gitignore`, `VLearn-Socratic-Tutor/.gitignore`. |

## F. Final Slide Deck

Final demo slide content is prepared in `demo-slides.md` at repo root. The deck script covers:

1. Problem: learners need slide-grounded review, not generic chatbot answers.
2. Solution: React lesson UI + Flask transcript-grounded AI tutor.
3. Demo flow: ask slide question, open citation, explain marked text, generate quiz.
4. Architecture: React/Vite -> Flask APIs -> retrieval/LLM -> transcript citations.
5. Evaluation: 24/24 marked-text benchmark, quiz validation tests, guardrails.
6. Feedback and iteration: named feedback log, changelog, dry-run outcome.

## G. Dry Run Log

| Time | Người chạy | Script demo | Result | Evidence / notes |
|---|---|---|---|---|
| 2026-07-30 22:14 ICT | Trần Anh Văn — 2A202601513 | Start Flask backend, call `/api/version`, verify API-only behavior. | Pass | `/api/version` returned tools/data-pack counts; `/` and `/static/...` returned `404`. |
| 2026-07-30 22:30 ICT | Lường Duy Thái — 2A202601021 | Build React/Vite UI after Markdown rendering. | Pass | `npm run build` passed; known warnings: unresolved altText SVGs, `pdfjs-dist` eval, large chunk. |
| 2026-07-30 22:45 ICT | Nguyễn Hoài Nam — 2A202601399 | Check Slide 4 suggestion accuracy. | Pass | `slides.length = 43`; Slide 4 prompts are “4 thành phần của prompt tốt là gì?” and “Tool calling là interface giữa model và thế giới ngoài như thế nào?” |
| 2026-07-30 22:55 ICT | Ngô Hoàng Gia Bảo — 2A202601375 | Run backend validation tests. | Pass | `python -m pytest tests/test_quiz_api.py tests/test_transcript_retrieval.py -q` -> `9 passed`. |

Dry-run conclusion: demo is ready for the current happy path and one failure path. Remaining non-blocking warnings are frontend build warnings from PDF/image assets and bundle size.

## H. Remaining Risks

- Quiz generation relies on provider quality after retrieval; validation rejects invalid output, but quiz content should still be checked with a dedicated quiz golden set.
- `Pass rate case chatlog` is still `N/A` until golden-set metadata is enriched with `origin = chatlog_mining`.
- Vite build warnings should be cleaned before production deployment, but they do not block the local demo.
