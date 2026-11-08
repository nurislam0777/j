# Smart Campus Room Availability Checker - Assignment #04

Author: Umirzakov Omar, 24B032085

- `v1-original/` - starting point: Bolt project exported as is (sb1-9fhc2ot9), one room B-204
- `v2-final/` - final version: room catalog, capacity/equipment filters, refactored modules
- `baseline-results.txt`, `final-results.txt` - real test output

## Requirements
Node.js 20+ (tested on v22), npm.

## Run
    cd v2-final
    npm install
    npm run dev        # open the localhost link that Vite prints
    npm run build      # production build into dist/

## Test
    cd v1-original && npm install && npm test   # 22 tests (baseline)
    cd v2-final    && npm install && npm test   # 35 tests (final)

Tests use vitest; the UI test uses the jsdom environment.
Fixed current time is 09:00. All rooms and bookings are fictional.
`src_buggy/` is the Practice #08 buggy version and is not used by the app.
