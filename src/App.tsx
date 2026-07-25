import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BackendInfo from "./pages/BackendInfo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Temporary: root sends visitors to the static design-concepts chooser
// (public/concepts.html) while the client picks a direction. The live
// pivoted site is preserved at /live-preview — swap this route back to
// <Index /> once a concept is chosen.
const RootRedirect = () => {
  useEffect(() => {
    window.location.replace("/concepts.html");
  }, []);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/live-preview" element={<Index />} />
          <Route path="/backend-info" element={<BackendInfo />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
