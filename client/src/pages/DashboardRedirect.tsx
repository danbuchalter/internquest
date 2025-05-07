// src/pages/dashboard-redirect.tsx
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";

const DashboardRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "intern") {
      navigate("/intern/dashboard");
    } else if (user?.role === "company") {
      navigate("/company/dashboard");
    } else {
      navigate("/auth");
    }
  }, [user, navigate]);

  return null; // Nothing to render
};

export default DashboardRedirect;