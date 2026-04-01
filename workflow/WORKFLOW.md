# Workflow: Product Shaping → Engineering Plan → Build

## Goal

Create a consistent, repeatable handshake between:

- Product Shaping (OpenClaw, non-engineer-friendly): use cases, flows, rules, acceptance criteria, constraints.
- Engineering Planning/Build (GSD/Claude Code or equivalent): architecture decisions, phased roadmap, atomic implementation tasks.

This workflow is optimized for:

- Web app features
- API products / service automations
- AI-assistant-adjacent products (quote generation, matching, booking flows)

---

## Roles

### Product/Marketing Peer ("Product")

Owns:

- The problem framing and target users
- Use cases and success criteria
- Flows (happy path + error/empty states)
- Business rules / policy (pricing, eligibility, matching)
- Acceptance criteria (testable)

Does *not* need to decide:

- Data model
- API shape (unless they have strong opinions)
- Implementation approach

### You ("Engineering")

Owns:

- System design decisions
- Scope slicing into phases
- API design + data model
- Delivery plan and execution

---

## Repo layout (single repo)

Inside the code repo:

- product/
  - README.md
  - 00-vision.md
  - 01-problem-and-users.md
  - 02-use-cases.md
  - 03-flows/
  - 04-rules-and-policy.md
  - 05-acceptance-criteria.md
  - 06-nonfunctional.md
  - 07-open-questions.md
  - 08-analytics-and-events.md
  - 09-glossary.md

Engineering bridge artifacts (optional but recommended):

- .planning/
  - INCOMING_BRIEF.md

Canonical truth: product/*.

---

## Cadence (the loop)

### 1) Product packet draft (Product)

- Create/update product/* artifacts.
- Keep language implementation-agnostic.
- Include realistic edge cases and policy.

### 2) Engineering intake + clarification (You)

- Read the packet.
- Convert it into an engineering-friendly bridge summary (`.planning/INCOMING_BRIEF.md`).
- Identify gaps and add them to product/07-open-questions.md.

### 3) Engineering planning (You)

- Use GSD discuss/plan steps with:
  - the bridge summary
  - direct references to canonical product/* paths
- Produce:
  - roadmap and phases (engineering)
  - atomic plans (engineering)

### 4) Build + feedback

- When constraints emerge, you propose options.
- Product updates flows/AC accordingly.

---

## GSD interoperability notes

GSD works best when you give it:

- Scope (v1 / v2 / out)
- Testable acceptance
- Rules/policy with precedence
- Nonfunctional constraints
- Links to canonical docs in-repo

A good bridge summary (`.planning/INCOMING_BRIEF.md`) usually contains:

- 10–30 bullet requirements
- 2–4 core flows
- The rule table / precedence
- 10–25 acceptance bullets
- 5–15 open questions

---

## Definition of Ready (before you plan)

A feature is "ready" for engineering planning when:

- Use cases have primary + failure flows
- Rules/policy are explicit (especially for quoting/matching)
- Acceptance criteria are testable
- Nonfunctional constraints are acknowledged (security/audit/latency)
- Open questions are enumerated
