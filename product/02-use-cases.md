# Use Cases

## Prioritized use cases (v1)

### UC1 — Define the event (type + date/time)

- User: Consumer event host
- Trigger: User wants to start building their event experience
- Goal: Select event type and event date/time so availability and pricing rules can be applied
- Success outcome: An event context exists for the package draft

Primary flow (high level):

1. User selects event category → event type.
2. User selects event date and start/end time.

---

### UC2 — Select a primary service (locked)

- User: Consumer event host
- Trigger: Event context exists
- Goal: Choose what primary experience they are booking
- Success outcome: Primary service is selected and locked for this package draft

Primary flow (high level):

1. User selects primary service (v1: DJ, Karaoke, Photo Booth).
2. System locks primary service for the current draft.

---

### UC3 — Customize the experience and see an estimate (tiered)

- User: Consumer event host
- Trigger: Primary service selected
- Goal: Build a package via tactile cards and understand estimated cost
- Success outcome: Package summary + estimated quote, ready to book

Primary flow (high level):

1. User selects tier (low/standard/high) (global).
2. User selects styles (if DJ) and services/add-ons from the pricebook.
3. For add-ons, user can set per-line-item timing or use full event duration.
4. System updates estimate in real time and shows breakdown.

---

### UC4 — Book (request + vendor confirmation)

- User: Consumer event host
- Trigger: Package is ready
- Goal: Submit a booking request to a vendor and get confirmation
- Success outcome: Booking confirmed (or declined) via vendor portal

Primary flow (high level):

1. User enters contact details and location (if not already provided).
2. User submits booking request.
3. System matches eligible vendors.
4. Vendor confirms/declines in vendor portal.

---

### UC5 — Event planners/agencies manage multi-vendor workflows

(Later / v2+)
