# Analytics & Events

## KPIs

- Time-to-shortlist
- Time-to-quote (request → first vendor response)
- Quote-to-book conversion
- Booking completion rate
- Vendor response rate and response time
- Repeat usage (planners)

## Event taxonomy

| Event | When it fires | Properties | Notes |
|---|---|---|---|
| search_performed | user runs a search | user_id?, category, location, date_range, filters | user_id optional if anonymous |
| vendor_profile_viewed | user views vendor profile | vendor_id, category, source | |
| vendor_shortlisted | user adds vendor to shortlist | vendor_id, event_id, category | |
| quote_requested | user requests a quote | request_id, vendor_count, category, event_id | |
| quote_received | vendor submits an offer | offer_id, vendor_id, request_id | |
| offer_selected | user selects an offer | offer_id, vendor_id, request_id | |
| booking_requested | user submits booking request | booking_id, vendor_id, event_id | |
| booking_confirmed | vendor confirms booking | booking_id, vendor_id, category | |

## Funnel (optional)

1. Search
2. View profile
3. Shortlist
4. Request quote
5. Receive quote
6. Select offer
7. Booking confirmed
