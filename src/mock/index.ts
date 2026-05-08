// ============================================================================
// Mock barrel — frontend-only seed data
// Centralizes all demo data used by the Travel OS shell. Replace with API
// adapters once a backend is connected; surfaces import from here only.
// ============================================================================

export {
  seedUser,
  seedActiveTrip,
  seedWallet,
  seedAirports,
  seedAirlines,
  seedHotels,
  totalWalletBalance,
} from "@/lib/travel-os";
