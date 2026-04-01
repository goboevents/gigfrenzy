# Nonfunctional Requirements

## Performance

- p95 latency target:
  - Search results p95 < 1.5s (excluding cold start) (TBD)
- Throughput expectations:
  - Support spikes around weekends/holidays (TBD)

## Reliability

- Availability target:
  - 99.9% for core browse/search/booking flows (TBD)
- Degraded mode:
  - If vendor messaging/quotes are delayed, still allow browsing + shortlist; show clear status.

## Security & privacy

- Data classification:
  - PII includes names, phone/email, event address, message content.
- PII handling:
  - Minimize retention; encrypt at rest; limit access by role.
- Auth requirements:
  - Users must authenticate to book and to view quote threads.

## Audit/logging

- Must record:
  - Quote request creation, vendor responses, booking confirmations/declines, key policy decisions.
- Retention:
  - Define retention for messages/PII (TBD).

## Compliance (if any)

- TBD (depends on payments and regions).
