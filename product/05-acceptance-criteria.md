# Acceptance Criteria

Write these so engineering can turn them into tests.

## Functional

- Given a user starts the GigFrenzy flow, when they arrive at the builder, then they can select an event category/type.
- Given a user has not entered ZIP code, when they try to proceed, then they are prompted to enter a ZIP code.
- Given a user enters an invalid ZIP code, when they try to proceed, then we show an error and allow correction.
- Given a user enters ZIP + event date/time, when they proceed, then they can choose a primary service (DJ/Karaoke/Photo Booth).
- Given a user selects a primary service, when they continue, then the primary service is locked for the current draft.
- Given a user selects styles/services/add-ons, when selections change, then the package summary and estimated quote update immediately.
- Given a user selects tier low/standard/high, when tier changes, then all tiered service prices update accordingly.
- Given a user taps “Review & book,” when contact details are missing, then the UI prompts for name, phone, and email.
- Given a user submits a booking request, when matching runs, then the system returns vendors who serve the ZIP area and can fulfill required selections.
- Given a vendor uses the vendor portal, when they view a booking request, then they can accept (confirm) or decline.

## Failure handling

- Given the user omits required fields (ZIP, date/time), when they attempt to proceed, then we show validation errors explaining what’s missing.
- Given there are no eligible vendors for the selected package, when matching runs, then we show a “no matches” state with suggested edits (remove add-ons, expand radius, adjust time window).

## Permissions / security

- Given a consumer is not authenticated, when they attempt to submit a booking request, then they are prompted to sign in or verify contact info (final decision TBD).
- Given a vendor user, when accessing booking requests, then they can only view requests sent to their vendor account.

## Observability

- When a user sets event type/date/time/ZIP, then we emit `event_context_set` with event_type, zip, start_time, end_time.
- When a user selects a primary service, then we emit `primary_service_selected` with primary_service.
- When a booking request is submitted, then we emit `booking_requested` with request_id, vendor_candidates_count.

## Non-goals (explicit)

- The system should not:
  - require full street address/venue capture in v1.
  - process payments/refunds in v1.
  - present the estimate as a guaranteed final price.
  - require vendors to maintain real-time availability in v1.
