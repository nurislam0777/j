# AGENTS.md

## Project
Smart Campus room availability checker: one room (B-204), fictional data, fixed current time 09:00.
Plain HTML/CSS/JavaScript built with Vite; booking rules in src/availability.js, UI in main.js, tests in tests/.

## Constraints
Preserve AC1-AC6; no backend, login, database or booking creation.
AC1: reject start >= end and requests in the past.
AC2: reject durations longer than 120 minutes (exactly 120 is allowed).
AC3: reject every request when the room is blocked.
AC4: reject overlaps; bookings that only touch at an endpoint are allowed.
AC5-AC6: never mutate booking data; keep clear Available/Unavailable feedback on desktop and mobile.

## Engineering rules
Prefer pure functions and minimal changes; use at most 2 justified patterns.
Do not add Singleton, Factory or class hierarchies without a concrete need.
Do not mutate booking fixtures and do not change fixture values.
Do not change the UI design, markup or style.css.
Do not modify or delete src_buggy/ (kept as Practice #08 evidence).

## Commands
Install: npm install
Tests: npm run test (vitest run)
Build: npm run build

## Verification
Run existing tests and add focused regression tests; never weaken or delete existing assertions.
Report changed files, rationale and test evidence, and list anything changed that was not requested.
