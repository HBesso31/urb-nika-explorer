import { PrivyProvider } from '@privy-io/react-auth';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivyAuthProvider } from "@/hooks/usePrivyAuth";
import Index from "./pages/Index";
import AuthPrivy from "./pages/AuthPrivy";
import Portal from "./pages/Portal";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID;

const App = () => (
  <PrivyProvider
    appId={PRIVY_APP_ID}
    config={{
      loginMethods: ['wallet', 'email'],
      appearance: {
        theme: 'light',
        accentColor: '#16a34a', // primary green
        logo: undefined,
      },
    }}
  >
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PrivyAuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPrivy />} />
              <Route path="/portal" element={<Portal />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </PrivyAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </PrivyProvider>
);

export default App;
