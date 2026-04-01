# INCOMING_BRIEF (Engineering intake)

> Purpose: a single file Engineering can hand to GSD / planners.
> Canonical docs remain in product/*.

## Links to canonical product docs

- Vision: product/00-vision.md
- Problem/users: product/01-problem-and-users.md
- Use cases: product/02-use-cases.md
- Flow: product/03-flows/dj-booking.md
- Rules/policy: product/04-rules-and-policy.md
- Acceptance: product/05-acceptance-criteria.md

## v1 scope (engineering phrasing)

- Consumer-first experience
- v1 builder anchors:
  1) event category/type (taxonomy: `product/taxonomy/event-types.json`)
  2) ZIP code only (location anchor)
  3) event date/time
  4) primary service selection (single-select; locked) (taxonomy: `product/taxonomy/primary-services.json`)
  5) tier (low/standard/high; global)
  6) customization selections (styles/services/add-ons)

- Primary services in v1: DJ, Karaoke, Photo Booth
- DJ styles taxonomy (if DJ): `product/taxonomy/dj-styles.json`
- Services pricebook + selection rules: `product/taxonomy/services.json`
- Add-on line items can have their own timing window (start/end) or “use full event duration”
- Photo booth supports multiple booth instances; duration/timing per instance
- Booking is confirmation-only: request → vendor confirms/declines in portal

## Engineering notes

- v1 does not capture full street address/venue; ZIP is the location input.
- `product/taxonomy/services.json` is versioned and includes tier rules, per-line-item timing guidance, and disabled services (e.g., music ensemble).

## Open questions

1. Add-ons taxonomy (separate from services): what add-ons exist and which are required vs optional?
2. Capability modeling: how do we represent vendor capabilities to ensure matching is accurate?
3. Estimate formula: travel fees, minimums, and rounding rules.
4. Do consumers need accounts for booking submission, or can we operate off verified contact info first?
5. Vendor portal MVP: notifications, response SLA, decline reasons.
