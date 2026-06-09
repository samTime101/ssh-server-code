import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, useLocation } from "react-router-dom";
import AuthProvider from "@/contexts/AuthContext.tsx";
import { ThemeProvider } from "@/contexts/ThemeContext.tsx";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/user/Header";

const AppShell = () => {
  const location = useLocation();
  const hideHeader = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideHeader && <Header />}
      <App />
    </>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppShell />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
