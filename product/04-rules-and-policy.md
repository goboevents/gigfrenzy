# Rules & Policy

This is the *most important* doc for quoting, matching, and automations.

## Inputs & sources of truth

- Customer input:
  - Event category + event type
  - Event ZIP code (location anchor) (**ZIP-only in v1**)
  - Event date + start/end time
  - Primary service selection (v1: DJ, Karaoke, Photo Booth)
  - Package selections (DJ styles, services, add-ons)
  - Tier selection (low / standard / high) (global)
  - Contact details (name, phone, email)
  - Optional per-line-item timing windows for add-ons
- Internal data:
  - Vendor profile (service area, capabilities offered, packages/add-ons supported)
  - Vendor availability handling (v1: vendor confirms on request; v2: real-time)
  - Vendor quality signals (ratings, response rate, completion rate) (lightweight v1)
  - Pricing model for estimates (tiered pricebook + selection rules)
  - Taxonomies (authoritative):
    - Event types: `product/taxonomy/event-types.json`
    - Primary services: `product/taxonomy/primary-services.json`
    - DJ styles: `product/taxonomy/dj-styles.json`
    - Services pricebook + rules: `product/taxonomy/services.json`
- External data:
  - Geo (ZIP → city/lat/long; distance/travel time)

## Taxonomy (v1)

- Selection order (v1):
  1) event category → event type
  2) event ZIP code
  3) event date/time
  4) primary service (locked)
  5) tier (global)
  6) customization (styles/services/add-ons)

## Location handling (v1)

- v1 captures **ZIP code only** (no full address/venue capture).
- ZIP code is captured early to support:
  - vendor eligibility filtering (service area)
  - rough travel heuristics for estimates (if used)

## Primary service (locked)

- User selects a primary service from: `product/taxonomy/primary-services.json`.
- Once selected, primary service is **locked** for the current package draft.

## Pricing model (estimate; v1)

- Quote is an **estimate** and must be labeled as such.
- Tier is **global** for the package.
- Services and base prices come from `product/taxonomy/services.json`.

## Matching model (v1)

- Matching must respect:
  - primary service type
  - eligibility (service area) using ZIP-derived geo
  - capability fit for required selections

## Auditability

- Record: event type, ZIP, date/time, primary service, tier, selections, per-line-item windows, and reasons vendors were excluded.
