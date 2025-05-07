import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./hooks/use-auth";
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter

// Ensure the correct provider hierarchy:
// 1. QueryClientProvider must be the outermost as AuthProvider uses React Query hooks
// 2. AuthProvider wraps the App so all components can access authentication
// 3. Router wraps the App to enable routing functionality across the app
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Router> {/* Wrap App in Router */}
        <App />
        <Toaster />
      </Router>
    </AuthProvider>
  </QueryClientProvider>
);
