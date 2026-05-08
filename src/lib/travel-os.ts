// ============================================================================
// Travel OS — domain model
// Backend-ready entity definitions + seed store. UI components consume these
// types and helpers so the data shape stays stable when a real API is wired.
// ============================================================================

export type ID = string;
export type ISODate = string;

export type User = {
  id: ID;
  name: string;
  email: string;
  loyalty: { airline: string; tier: string; number: string }[];
  preferences: {
    seat: "window" | "aisle" | "any";
    minTransferMinutes: number;
    avoidRedEye: boolean;
    cabin: "economy" | "premium" | "business";
  };
};

export type Traveler = {
  id: ID;
  fullName: string;
  documentType: "passport" | "id";
  documentExpiry: ISODate;
  knownTraveler?: string;
  verified: boolean;
};

export type Segment = {
  id: ID;
  mode: "flight" | "rail" | "transfer";
  carrier: string;
  number: string;
  from: { code: string; city: string; terminal?: string };
  to: { code: string; city: string; terminal?: string };
  departAt: ISODate;
  arriveAt: ISODate;
  seat?: string;
  gate?: string;
  gatePredicted?: boolean;
  baggageBelt?: string;
  onTimeScore: number; // 0–100
};

export type Booking = {
  id: ID;
  reference: string;
  status: "pending" | "confirmed" | "active" | "completed" | "refunded";
  segments: Segment[];
  travelerIds: ID[];
  total: number;
  currency: string;
  createdAt: ISODate;
};

export type Trip = {
  id: ID;
  title: string;
  status: "draft" | "upcoming" | "active" | "completed";
  startDate: ISODate;
  endDate: ISODate;
  bookings: Booking[];
  budget?: { allocated: number; spent: number; currency: string };
  // Operational scores aggregated from segments + AI signals.
  calmScore: number;
  disruptionRisk: number;
  weatherConfidence: number;
  transferComfort: number;
};

export type WalletAccount = {
  id: ID;
  category: "flights" | "hotels" | "rail" | "packages" | "experiences" | "shared" | "gifted" | "refund";
  label: string;
  balance: number;
  currency: string;
};

export type Transaction = {
  id: ID;
  accountId: ID;
  kind: "credit" | "debit" | "refund" | "gift" | "allocation";
  amount: number;
  description: string;
  occurredAt: ISODate;
  tripId?: ID;
};

export type IntelligenceEvent = {
  id: ID;
  source: "weather" | "airport" | "carrier" | "wallet" | "profile" | "schedule" | "ai";
  severity: "info" | "positive" | "watch" | "alert";
  title: string;
  body: string;
  tripId?: ID;
  bookingId?: ID;
  occurredAt: ISODate;
  // Actionable hint — used by intelligence-engine to attach a CTA.
  action?: { label: string; href: string };
};

export type NotificationItem = {
  id: ID;
  title: string;
  body: string;
  occurredAt: ISODate;
  read: boolean;
  tripId?: ID;
};

export type Recommendation = {
  id: ID;
  reason: string; // human-readable why
  signal: "calmer" | "cheaper" | "faster" | "preferred";
  optionId?: string;
};

export type SavedSearch = {
  id: ID;
  from: string;
  to: string;
  cadence: "anytime" | "weekend" | "monthly";
  alertOn: ("price" | "calm" | "availability")[];
};

export type CompareState = {
  optionIds: string[];
  pinned?: string;
};

// ─── Seed (frontend prototype) ────────────────────────────────────────────
// Stable demo state used by dashboard + trip + wallet surfaces. Replace with
// API responses once Travel OS backend is connected.

export const seedUser: User = {
  id: "u_emma",
  name: "Emma",
  email: "emma@travixis.com",
  loyalty: [
    { airline: "KLM", tier: "Gold", number: "FB7782914" },
    { airline: "TAP", tier: "Silver", number: "TP4429012" },
  ],
  preferences: {
    seat: "window",
    minTransferMinutes: 75,
    avoidRedEye: true,
    cabin: "economy",
  },
};

export const seedActiveTrip: Trip = {
  id: "trip_lis_jul",
  title: "Lisbon · Summer escape",
  status: "upcoming",
  startDate: "2026-07-14",
  endDate: "2026-07-21",
  calmScore: 86,
  disruptionRisk: 14,
  weatherConfidence: 82,
  transferComfort: 91,
  bookings: [
    {
      id: "bk_lis_out",
      reference: "TVX-LIS-04812",
      status: "confirmed",
      total: 412,
      currency: "EUR",
      createdAt: "2026-05-01T09:12:00Z",
      travelerIds: ["t_emma"],
      segments: [
        {
          id: "seg_kl1693",
          mode: "flight",
          carrier: "KLM",
          number: "KL1693",
          from: { code: "AMS", city: "Amsterdam", terminal: "Terminal 3" },
          to: { code: "LIS", city: "Lisbon", terminal: "Terminal 1" },
          departAt: "2026-07-14T07:55:00+02:00",
          arriveAt: "2026-07-14T10:25:00+01:00",
          seat: "14A",
          gate: "D58",
          gatePredicted: true,
          onTimeScore: 88,
        },
      ],
    },
  ],
  budget: { allocated: 1800, spent: 412, currency: "EUR" },
};

export const seedWallet: { accounts: WalletAccount[]; transactions: Transaction[] } = {
  accounts: [
    { id: "w_flights", category: "flights", label: "Flights", balance: 620, currency: "EUR" },
    { id: "w_hotels", category: "hotels", label: "Hotels", balance: 410, currency: "EUR" },
    { id: "w_rail", category: "rail", label: "Rail", balance: 180, currency: "EUR" },
    { id: "w_pkg", category: "packages", label: "Packages", balance: 70, currency: "EUR" },
    { id: "w_exp", category: "experiences", label: "Experiences", balance: 140, currency: "EUR" },
    { id: "w_shared", category: "shared", label: "Shared funding", balance: 240, currency: "EUR" },
    { id: "w_gift", category: "gifted", label: "Gifted credits", balance: 90, currency: "EUR" },
    { id: "w_refund", category: "refund", label: "Refund balance", balance: 38, currency: "EUR" },
  ],
  transactions: [
    { id: "tx_1", accountId: "w_flights", kind: "debit", amount: 412, description: "KLM AMS → LIS", occurredAt: "2026-05-01T09:12:00Z", tripId: "trip_lis_jul" },
    { id: "tx_2", accountId: "w_gift", kind: "gift", amount: 90, description: "Gifted by Marco", occurredAt: "2026-04-21T14:02:00Z" },
    { id: "tx_3", accountId: "w_refund", kind: "refund", amount: 38, description: "Fare drop credit · KL1693", occurredAt: "2026-05-04T11:30:00Z", tripId: "trip_lis_jul" },
  ],
};

export const totalWalletBalance = (accounts: WalletAccount[] = seedWallet.accounts) =>
  accounts.reduce((sum, a) => sum + a.balance, 0);
