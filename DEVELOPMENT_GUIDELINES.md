# 🛡️ Development Guidelines & Guardrails

*Unified AI IDE Governance, Testing & Database Rules*

This file defines required standards for authoring, testing, deploying, and maintaining secure, scalable, observable systems.

---

## A. Requirements & Decision Discipline

1. No code may be authored until ≥ 95% confident in requirements.
2. Ask follow-up questions proactively if confidence is < 95%.
3. Follow vertical slicing: break features into shippable, testable parts.
4. Do not mock any results in the code. Every module, every function is to be written as real code, and mocking parts is strictly forbidden.
5. If a module is not functioning, at all cost do not create workarounds but instead make sure, that the core problem is fixed, rather than working around the problem and taking shortcuts.

---

## B. Mandatory Testing

4. Every file must ship with deterministic tests (`*.test.ts|tsx`).
   - Applies to all logic, screens, modules, hooks, services, and Edge Functions.
   - Tests tracked via `vitest`
5. Critical flows require contract tests using real HTTP payloads and shared types from `src/types/`.

---

## C. Code Structure & Size

6. Keep files ≤ 300 LOC; refactor into hooks/components/services when larger.
7. Never duplicate existing logic; reuse repo-wide helpers/components.
8. Maintain fully pluggable architecture (e.g., scanner types, upload adapters).
9. New code must preserve current FE design and style conventions.

---

## D. Logging & Observability

10. Add debug logs to:
   - FE actions: modals, nav, API triggers, form submits.
   - Edge Functions: request parse, MCP dispatch, DB write/storage events.
11. Log format:
   - Prefix: `[ComponentOrFn]`
   - Context-rich (step, stage, ID) but no PII
   - Log both success and error paths
12. No silent fails. Design logs to preempt future debugging needs.

---

## E. Security & Privacy

13. Never store unauthenticated user data in Supabase.
14. All sensitive operations must be handled in Edge Functions.
15. Supabase RLS must be enforced; never bypassed.
16. Never expose secrets or internal business logic in client bundles.
17. Read secrets only from `.env.*` or Supabase Secret Manager.
18. If secrets are missing or undefined, halt execution and raise an error.

---

## F. Supabase DB & Auth Safety

19. Parse latest `schema.prisma` + Supabase tables before emitting queries.
20. Validate all FK chains, auth.uid() requirements, and RLS logic in commit summary.
21. All data PRs require a "DB Access Sheet":
   `tables:, rls:, required_jwt_claims:, constraints:`
22. Test DB auth via Vitest using real sessions, JWT tokens, and RLS denial assertions.
23. Frontend must use absolute Supabase URLs with session tokens (`supabase.auth.getSession()`).
24. Validate all required environment variables in CI before deployment.
25. Edge Functions must:
   - Validate FK consistency (`select exists(...)`)
   - Reject malformed payloads (use shared types)
   - Be tested with simulated HTTP or `vi.fetch`

---

## G. Interface Contract Testing

26. All shared request/response types live in `/types` and are imported into:
   - Edge Functions
   - FE services (e.g., `apiService.ts`)
   - Optional schema validators (e.g., Zod)
27. Every contract boundary must be tested for:
   - Payload shape
   - Auth tokens
   - Error behavior
   - Response validity
28. No FE service may call an Edge Function without importing its request/response types.

---

## H. Project Hygiene & Scope Management

29. Follow docs/README.md and RTF files as the single source of truth.
30. NEVER delete or bulk-edit shared files without ALL-CAPS alert and human approval.
31. Mock data is allowed only in tests—never in live dev or prod code.
32. Avoid premature abstractions; prefer smallest viable change.
33. All changes must be scoped to the assigned task/ticket only.
34. Always build locally before pushing to GitHub, Vercel, or Netlify.
35. List all potentially affected modules in PRs and confirm test coverage.
36. Never overwrite `.env` files without confirmation.

---

## I. Third-Party Integration Standards

37. Build MCP blocks for all third-party services (Stripe, Netlify, Supabase, GPT, etc.).
38. Include:
   - Auth flow validation
   - Health check endpoints
   - Webhook signature verification
   - Error handling and retry logic
   - Cost surface estimates in PRs
   - Quota metering via UsageMeter

---

## J. Dependency Management

39. Maintain `docs/dependency-tracker.md`; update with every added package.
40. Validate all dependencies before deploy with scripts in `package.json`.
41. Lock versions; monitor for vulnerabilities.
42. Document special setups for serverless usage (Redis, Puppeteer, etc.).

---

## K. Frontend UX Standards

43. FE must be modular, responsive, accessible, and support:
   - Loading, empty, and error states
   - Clear user flows
   - Reusable components
   - Style consistency with design system

---

## L. Technical-Debt Zero Tolerance

**Goal:** Make the codebase changeable, understandable, and fast.

### Lifecycle Guardrails

| Stage          | Requirement                                                | Check Question                            |
|----------------|------------------------------------------------------------|-------------------------------------------|
| Design         | Use vertical slices; log trade-offs in ADR                 | Could a new dev grok this in <10 min?     |
| Implementation | PR ≤ 400 LOC; centralized flags; lint clean                | Is there a single place to update later?  |
| Testing        | ≥ 90% coverage for core paths                              | Will a failing test expose the bug fast?  |
| Review         | 2 reviewers; confirm rollback plan + test completeness     | Can we revert this with 1 commit?         |
| Merge          | Pass CI, security scans, and static analysis               | Confident this won't break prod?          |
| Post-Merge     | Create a cleanup/follow-up ticket                          | Will future-you thank you or curse you?   |
| Maintenance    | Weekly dep bumps; quarterly debt-burndown sprint           | Any TODO older than 90 days?              |

### Enforcement
- PR template includes "Tech Debt Created?" checkbox
- TODOs with `@debt` are exported to Grafana dashboard
- CI blocks merge if >30 open debt items or >5% growth (unless override)
- Retro: celebrate 1 paid item, flag 1 outstanding

---

## M. Schema Migration Workflow

### Migration Rules
44. Each schema change = one SQL file in `/supabase/migrations/`
   - Naming: `YYYYMMDDHHMMSS_description.sql`
   - NEVER modify old migrations or mark them applied manually

### Migration Workflow
1. Run `npx supabase@1.153.0 db pull` to sync schema
2. Write a new migration file
3. Test locally (`supabase start`)
4. Push:
   `npx supabase db push --db-url="postgres://..."`
5. Pull again to confirm match

### Tips
- Always run `db pull` before starting schema changes
- Never bypass the migration log
- Commit migrations with the feature branch

---

## N. CI Quality Gates

45. PR will fail if:
   - Coverage < 80%
   - Lint/type-check errors
   - Missing contract tests
   - Pa11y score < 90% on key screens

---

> 🎯 Add `Guardrails A–N apply` to each task header. CI and reviewers will enforce these standards.