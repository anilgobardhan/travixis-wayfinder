import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/Layout";
import Landing from "./pages/Landing";
import SearchPage from "./pages/SearchPage";
import AutopilotRunPage from "./pages/AutopilotRunPage";
import ResultsPage from "./pages/ResultsPage";
import OptionDetailPage from "./pages/OptionDetailPage";
import TripDashboardPage from "./pages/TripDashboardPage";
import DocumentsPage from "./pages/DocumentsPage";
import SupportPage from "./pages/SupportPage";
import WalletPage from "./pages/WalletPage";
import BookingReviewPage from "./pages/BookingReviewPage";
import MyTripsPage from "./pages/MyTripsPage";
import SavedSearchesPage from "./pages/SavedSearchesPage";
import TravelProfilePage from "./pages/TravelProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/autopilot" element={<AutopilotRunPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/option/:id" element={<OptionDetailPage />} />
            <Route path="/option-detail" element={<OptionDetailPage />} />
            <Route path="/trip" element={<TripDashboardPage />} />
            <Route path="/trip-dashboard" element={<TripDashboardPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/booking-review" element={<BookingReviewPage />} />
            <Route path="/my-trips" element={<MyTripsPage />} />
            <Route path="/saved-searches" element={<SavedSearchesPage />} />
            <Route path="/profile" element={<TravelProfilePage />} />
            <Route path="/account" element={<TravelProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
