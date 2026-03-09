# AGENTS.md

## Project overview

This project is a React + Vite + TypeScript + TailwindCSS frontend with Framer Motion.
It is mobile-first and currently prioritizes stable responsive behavior on small mobile devices.

## Global rules

- Prioritize mobile-first changes.
- Do not optimize desktop unless explicitly requested.
- Avoid brittle layout hacks.
- Avoid fixed heights and widths unless strongly justified.
- Prefer fluid spacing, typography, and layout composition.
- Do not reintroduce scroll snapping or unstable route-based scroll behavior.
- Keep the project functional after each change.
- Preserve visual intent where possible.

## Specialized roles

Use specialized skills when appropriate:

- frontend-auditor: audit technical debt, fragile layout, duplicated styles, and maintainability risks
- responsive-refactorer: refactor mobile-first layout, viewport-height issues, and relative sizing
- ui-ux-consistency-reviewer: review hierarchy, spacing rhythm, CTA placement, and visual consistency
- accessibility-semantics-reviewer: review semantic HTML, heading hierarchy, and baseline accessibility
- bug-hunter-debugger: diagnose root causes of scroll, overflow, fixed/sticky, and animation-related bugs
- architecture-standards-guardian: validate maintainability and prevent new technical debt after changes

## Workflow

For significant frontend changes:

1. Audit first
2. Create a plan
3. Implement incrementally
4. Validate final quality

## Current project priorities

- Stable mobile navigation
- Responsive navbar/menu on very small devices
- Viewport-height-aware layouts
- Relative typography and spacing
- Production-ready frontend structure

## Validation expectations

Before finalizing:

- Confirm no horizontal overflow
- Confirm mobile layouts fit in small-height devices
- Confirm no broken navigation between routes
- Confirm no regressions in contact route or navbar interactions
