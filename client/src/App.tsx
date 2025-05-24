import { Routes, Route, useLocation } from "react-router-dom";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import StudentDashboard from "@/pages/student-dashboard";
import CompanyDashboard from "@/pages/company-dashboard";
import InternshipList from "@/pages/internship-list";
import InternshipDetail from "@/pages/internship-detail";
import SavedInternships from "@/pages/saved-internships";
import PostInternship from "@/pages/post-internship";
import ApplicationsView from "@/pages/applications-view";
import UserTypeSelection from "@/pages/user-type-selection";
import { ProtectedRoute } from "./lib/protected-route";
import Navbar from "./components/layout/navbar";
import Footer from "./components/layout/footer";

// ✅ Informational pages
import ApplicationTips from "@/pages/ApplicationTips";
import InternshipGuide from "@/pages/InternshipGuide";
import OurMission from "@/pages/OurMission";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import PartnerBenefits from "@/pages/PartnerBenefits";
import TermsOfService from "@/pages/TermsOfService";
import ContactUs from "@/pages/ContactUs";

// ✅ New informational pages
import InternshipPreparation from "@/pages/ InternshipPreparation";
import EmployerResources from "@/pages/EmployerResources";
import IndustryInsights from "@/pages/IndustryInsights";

// ✅ New dashboard redirect component
import DashboardRedirect from "@/pages/DashboardRedirect";
import InternRegister from "@/pages/InternRegister";
import CompanyRegister from "@/pages/CompanyRegister";
import LoginPage from "@/pages/LoginPage";

// Forgot and reset password pages
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

function Router() {
  const location = useLocation();

  // Only hide navbar on exact auth-related routes
  const hideNavbarExactPaths = [
    "/login",
    "/auth",
    "/register",
    "/register/intern",
    "/register/company",
    "/forgot-password",
    "/reset-password"
  ];
  const isNavbarHidden = hideNavbarExactPaths.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="hidden p-4 bg-primary text-white">
        Tailwind CSS is working!
      </div>

      {!isNavbarHidden && <Navbar />}

      <div className="flex-grow w-full">
        <Routes>
          {/* Core routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<UserTypeSelection />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/internships" element={<InternshipList />} />
          <Route path="/internships/:id" element={<InternshipDetail id={""} />} />

          {/* Informational Pages */}
          <Route path="/application-tips" element={<ApplicationTips />} />
          <Route path="/internship-guide" element={<InternshipGuide />} />
          <Route path="/our-mission" element={<OurMission />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/partner-benefits" element={<PartnerBenefits />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/contact-us" element={<ContactUs />} />

          <Route path="/internship-preparation" element={<InternshipPreparation />} />
          <Route path="/employer-resources" element={<EmployerResources />} />
          <Route path="/industry-insights" element={<IndustryInsights />} />

          {/* Intern Routes */}
          <Route
            path="/intern/dashboard"
            element={
              <ProtectedRoute requiredRole="intern">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-internships"
            element={
              <ProtectedRoute requiredRole="intern">
                <SavedInternships />
              </ProtectedRoute>
            }
          />

          {/* Company Routes */}
          <Route
            path="/company/dashboard"
            element={
              <ProtectedRoute requiredRole="company">
                <CompanyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post-internship"
            element={
              <ProtectedRoute requiredRole="company">
                <PostInternship />
              </ProtectedRoute>
            }
          />

          {/* Registration Pages */}
          <Route path="/register/intern" element={<InternRegister />} />
          <Route path="/register/company" element={<CompanyRegister />} />

          {/* Applications view */}
          <Route path="/applications/:id" element={<ApplicationsView id={""} />} />

          {/* Dashboard redirect */}
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

function App() {
  return <Router />;
}

export default App;