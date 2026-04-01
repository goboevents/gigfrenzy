# Product → Engineering Handoff Checklist (repeatable)

Use this checklist when handing a feature/idea from Product (OpenClaw) to Engineering (GSD / implementation).

## Required files updated

- [ ] product/00-vision.md
- [ ] product/02-use-cases.md
- [ ] product/03-flows/<feature>.md
- [ ] product/04-rules-and-policy.md (or a feature-specific section)
- [ ] product/05-acceptance-criteria.md
- [ ] product/06-nonfunctional.md
- [ ] product/07-open-questions.md

## Quality gates

### Vision / scope

- [ ] Target user clearly defined
- [ ] What is *in v1* vs *later* vs *out* is stated
- [ ] Success metric / "how we know it worked" is written

### Use cases

- [ ] Top 3–10 use cases listed
- [ ] Each use case has: trigger, user goal, success outcome
- [ ] At least 3 edge cases identified for the top 2 use cases

### Flows

- [ ] Happy path steps are numbered
- [ ] Error states included (invalid input, no match, payment failure, timeout)
- [ ] Empty states included (no history, no available contractors, no saved rules)
- [ ] Re-entry / resume behavior defined (user leaves and comes back)

### Rules & policy (critical for quote/matching)

- [ ] Inputs and sources of truth listed
- [ ] Rule precedence is explicit (what wins)
- [ ] Audit requirements: can we explain “why this quote/match?”
- [ ] Manual override / approval points defined (if any)

### Acceptance criteria

- [ ] Written as testable bullets (Given/When/Then preferred)
- [ ] Covers: permissions/auth, main flows, failure flows
- [ ] Includes at least 3 “should not” criteria (non-goals)

### Nonfunctional

- [ ] Security/privacy considerations captured
- [ ] Logging/audit expectations captured
- [ ] Performance target noted (even if rough)

## Optional but useful

- [ ] product/08-analytics-and-events.md updated
- [ ] product/09-glossary.md updated
- [ ] Screenshots/wireframes linked (Figma, etc.)

## Engineering intake outputs

- [ ] .planning/INCOMING_BRIEF.md generated
- [ ] Engineering added/updated open questions in product/07-open-questions.md
