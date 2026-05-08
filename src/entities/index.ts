// ============================================================================
// Entities barrel — Travel OS domain types
// Single import surface for all typed travel entities. Backend-ready: when an
// API is wired, these types stay; only the data source changes.
// ============================================================================

export type {
  ID,
  ISODate,
  User,
  Traveler,
  Segment,
  Booking,
  Trip,
  WalletAccount,
  Transaction,
  IntelligenceEvent,
  NotificationItem,
  Recommendation,
  SavedSearch,
  CompareState,
  Airport,
  Airline,
  Hotel,
} from "@/lib/travel-os";
