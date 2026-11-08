# AGENTS.md

## Project
Smart Campus room availability checker: catalog of 5 fictional rooms, fixed current time 09:00.
Plain HTML/CSS/JavaScript built with Vite.
- src/data/rooms.js: frozen room catalog (id, name, capacity, equipment, blocked, bookings)
- src/time.js: time helpers, MS_PER_MIN (all times are ms since midnight)
- src/availability.js: booking rules (explainAvailability, findConflict, explainRoom)
- src/filter.js: capacity and equipment filter (F1, F2)
- src/ui/render.js + src/ui/catalog.css: rendering only
- main.js: state and event wiring
- tests/: vitest (rules, catalog/filter, UI with jsdom)

## Constraints
Preserve AC1-AC6; no backend, login, database or booking creation.
AC1: reject start >= end and requests in the past.
AC2: reject durations longer than 120 minutes (exactly 120 is allowed).
AC3: reject every request when the room is blocked.
AC4: reject overlaps; bookings that only touch at an endpoint are allowed.
AC5-AC6: never mutate booking data; keep clear Available/Unavailable feedback on desktop and mobile.
F1: capacity >= attendees. F2: room has ALL selected equipment. F3: blocked room is never available.
F4: clear empty state when no rooms match. F5: changing room refreshes the result.

## Engineering rules
Prefer pure functions and minimal changes; use at most 2 justified patterns.
Do not add Singleton, Factory or class hierarchies without a concrete need.
Do not mutate booking fixtures and do not change fixture values.
Do not change style.css; new styles go to src/ui/catalog.css. Keep the existing card design.
Do not modify or delete src_buggy/ (kept as Practice #08 evidence).

## Commands
Install: npm install
Tests: npm run test (vitest run)
Build: npm run build

## Verification
Run existing tests and add focused regression tests; never weaken or delete existing assertions.
Report changed files, rationale and test evidence, and list anything changed that was not requested.
