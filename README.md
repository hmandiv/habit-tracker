# Habit Tracker (Local-First)

A local-first Habit Tracker.

## Stack baseline

- **Vite + React + TypeScript**
- Unit/Component tests: **Vitest** + **React Testing Library**
- E2E: **Playwright**
- Lint/Format: **ESLint + Prettier**
- Optional later: `msw` (not needed for local-first MVP)

---

## Project goals

- **Fast daily use**: open → tap → done.
- **Local-first**: data persists in `localStorage` (no backend).
- **Derived state over stored state**: compute streaks from check-ins to avoid bugs.
- **Good engineering hygiene**: tests + CI from day 1.

---

## MVP: screens + routing

Ship with **two screens only**.

### 1) Today (Home) — `/`

- Shows **today’s date**
- List of habits with a big, fast action: **tap to check-in today**
- Each row shows:
  - habit name
  - today status (done / not done)
  - current streak number
- One **Add habit** button

### 2) Habit Detail — `/habits/:id`

- Edit name / delete
- Shows recent check-ins (start with a simple list like **last 14 days**, not a full calendar)
- Mark today done / undo
- Basic stats:
  - current streak
  - best streak (optional for MVP; can be added later)
  - total check-ins

---

## Data model (local-first)

### Stored (persisted)

Keep storage **dumb + normalized**.

- `habits`: list of `{ id, name, createdAt, archived? }`
- `checkins`: key-value by `habitId` of checked dates
  - mental model:
    - `checkins[habitId] = ["2025-12-27", "2025-12-26", ...]` (ISO date strings)

### Derived (computed at runtime)

Compute “smart” stuff from stored data:

- `isDoneToday(habitId, today)`
- `currentStreak(habitId, today)`
- `bestStreak(habitId)` (optional for MVP)
- `totalCheckins(habitId)`
- “Last 14 days status list” for the detail screen

**Architect rule:** don’t store streak numbers if you can derive them from check-ins.

---

## Code organization

Feature-first boundaries:

- src/
- features/
- habits/
- pages/ # route-level screens (Today, HabitDetail)
- model/ # types + pure logic (derive streaks, done today, etc.)
- ui/ # feature UI components (HabitRow, HabitList)
- shared/
- storage/ # localStorage helpers + persistence
- lib/ # small helpers (date utils, assertions)
- ui/ # shared UI primitives (Button, Input, etc.)

Guiding principle:

- **model**: pure functions, easy to test
- **pages**: compose UI + call model
- **shared**: reusable utilities, no business logic

---

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm test
npm run test:run

```

## Testing strategy

- **Unit/model tests**: streak and date logic (pure functions) in features/habits/model

- **Component tests**: rendering and interactions with React Testing Library

- **E2E tests (Playwright)**: “user can add habit, check in today, see streak increment”

## CI

- **GitHub Actions runs on PRs**:

- lint

- test (Vitest run)

- build

## Roadmap

- Habits CRUD (in-memory → persisted)

- Daily check-in toggle

- Derived current streak

- Habit detail stats + last 14 days list

- Minimal styling polish

- Playwright E2E happy-path test
