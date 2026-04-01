# Flow — Build & book an event experience (v1)

## Overview

- Entry points:
  - Home → “Book your dream event. today.”
- Exit points:
  - Booking request submitted (pending vendor confirmation)
  - Booking confirmed (after vendor accepts in portal)
  - Fallback: user saves package draft and leaves
- Preconditions:
  - None.

## Happy path

1. User selects an **event category**.
2. User selects an **event type** within that category.
3. User enters **event ZIP code** (location anchor).
4. User selects **event date** and **event start/end time**.
5. User selects a **primary service** (v1: DJ, Karaoke, Photo Booth).
   - Once selected, the primary service is **locked** for the current package draft.
6. User selects a **production tier** (low / standard / high). (Tier is global.)
7. User customizes the experience based on the chosen primary service.
8. GF updates a **package summary** and **estimated quote** in real time.
9. User taps “Review & book.”
10. User enters contact details (name, phone, email).
11. GF shows final review screen:
   - package selections
   - estimated quote disclaimer (“estimate—vendor will confirm”)
   - key policies/expectations (v1 lightweight)
12. User taps “Book” (accept package).
13. GF matches to eligible vendors who can fulfill the package and presents the top options.
14. User selects a vendor.
15. GF submits a **booking request** to the vendor.
16. Vendor reviews request in vendor portal and confirms/declines.
17. GF notifies the user and displays booking status.

## Variants

### Variant A: No vendors can fulfill the package

1. GF shows “no matches” state.
2. GF suggests edits (remove/replace services/add-ons, expand radius, alternate time window).
3. User edits package and retries.

### Variant B: User changes their mind on primary service

- User must start a new package draft (or explicitly reset) to pick a different primary service.

## Error states

- Missing ZIP code:
  - Cannot proceed to date/time.
- Missing date/time:
  - Cannot proceed to primary service selection.
- Invalid ZIP code:
  - Prompt correction.

## Re-entry / resume

- Save draft selections continuously and restore on return.

## Notes

- v1 location is ZIP-only (no full address/venue capture).
- Copy tone notes:
  - Still tactile/card-based; ZIP/date/time and primary service are the “anchors.”
- Accessibility notes:
  - Card UI must be keyboard navigable and screen-reader friendly.
