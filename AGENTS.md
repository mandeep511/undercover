# Repository Guidelines

## Core Context
This is a single-page social deduction game (Undercover/Mr. White) with stateful sessions and persistent player/team history in `localStorage`.

- UI/markup flow: `index.html`
- Global state/settings/data: `js/app.js` (`App.state`, `App.storage`, word banks/pairs)
- Game behavior: `js/game.js` (`Game.setup`, `Game.core`, `Game.cardReveal`, `Game.voting`, `Game.teams`)

## Change Nuances (Important)
- Prefer extending existing `App`/`Game` namespaces over adding new top-level globals.
- If adding a new setting, update all of these together:
  - default in `App.state.settings`
  - setup UI control in `index.html`
  - read/write in `Game.setup.updateSettings()`
  - restore/sync on load (`DOMContentLoaded` + setup sync path)
  - persistence through existing `App.storage.save/load` flow
- Reuse existing selectors and modal/screen helpers (`showScreen`, `showModal`, `closeModal`) instead of introducing parallel patterns.

## Gameplay Logic Patterns
- Role/word assignment lives in `Game.core.assignRolesAndWords()`; turn order logic is centralized in `Game.core.getTurnOrder()`.
- Any new gameplay rule that affects role assignment, start order, or round flow should be implemented in `Game.core` as policy logic (not scattered UI conditionals).
- Keep weighted/random fairness systems intact when adding constraints (role history, starting history, word exposure).

## Keep It Tight
- Make minimal, localized edits and preserve existing naming/style patterns.
- When behavior changes, also update any dependent screen text/controls so setup, reveal, and discussion/voting stay consistent end-to-end.
