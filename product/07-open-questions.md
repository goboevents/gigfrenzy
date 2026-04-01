# Open Questions

Track uncertainties here; close them explicitly.

## Questions

1. What are the initial launch market(s) and service radius rules?
2. What is the initial taxonomy for DJ styles, services, and add-ons (the card sections)?
3. How do we model DJ capabilities to ensure matching is accurate (what a DJ can fulfill)?
4. What is the estimate pricing model (breakdown + assumptions + rounding rules)?
5. Do consumers need accounts to submit a booking request, or can we book with verified contact info first?
6. What is the vendor portal MVP (web-only, notifications, response SLA, decline reasons)?
7. How do we handle vendor declines—do we auto-route the same package to the next eligible DJ?
8. What is the take-rate model (who pays it, when, and how measured) given no payments in v1?

## Decisions made (closed)

- v1 is DJ-only.
- Vendors respond via a portal.
- v1 booking is confirmation-only (no contracts/payments); quote shown to consumers is an estimate subject to vendor confirmation.
- Monetization: take rate first, vendor subscription later.
- Open vendor signup in v1; verification/security later.
- UX is experience-first: package builder (cards) first, details later.
