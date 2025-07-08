import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import AdminPage from "./pages/AdminPage";
import PatientPage from "./pages/PatientPage";
import PatientsPage from "./pages/admin/PatientsPage";
import AppointmentsPage from "./pages/admin/AppointmentsPage";
import CalendarPage from "./pages/admin/CalendarPage";
import PatientAppointmentsPage from "./pages/patient/PatientAppointmentsPage";
import NotFound from "./pages/NotFound";
import { DataProvider } from "./lib/DataProvider";

const queryClient = new QueryClient();

const App = () => (
  <DataProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="dental-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/patients" element={<PatientsPage />} />
              <Route path="/admin/appointments" element={<AppointmentsPage />} />
              <Route path="/admin/calendar" element={<CalendarPage />} />
              <Route path="/patient" element={<PatientPage />} />
              <Route path="/patient/appointments" element={<PatientAppointmentsPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </DataProvider>
);

export default App;
