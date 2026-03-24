import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import CustomizePage from "./pages/CustomizePage";
import DashboardPage from "./pages/DashboardPage";
import FoodPage from "./pages/FoodPage";
import JobsPage from "./pages/JobsPage";
import LandingPage from "./pages/LandingPage";
import TasksPage from "./pages/TasksPage";

const queryClient = new QueryClient();

type Page = "home" | "dashboard" | "food" | "tasks" | "jobs" | "customize";

function AppContent() {
  const { identity } = useInternetIdentity();
  const [page, setPage] = useState<Page>("home");

  const navigate = (p: Page) => {
    if (p !== "home" && !identity) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    if (!identity && page !== "home") {
      return <LandingPage onNavigate={navigate} />;
    }
    switch (page) {
      case "dashboard":
        return <DashboardPage onNavigate={navigate} />;
      case "food":
        return <FoodPage />;
      case "tasks":
        return <TasksPage />;
      case "jobs":
        return <JobsPage />;
      case "customize":
        return <CustomizePage />;
      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage={page} onNavigate={navigate} />
      {renderPage()}
      <Footer />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <AppContent />
      </InternetIdentityProvider>
    </QueryClientProvider>
  );
}
