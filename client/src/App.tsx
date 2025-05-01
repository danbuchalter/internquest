import { Switch, Route, Redirect, useLocation } from "wouter";
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

// Static content pages
import ApplicationTips from "@/pages/ApplicationTips";
import InternshipGuide from "@/pages/InternshipGuide";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsofService";
import Contact from "@/pages/Contact";
import OurMission from "@/pages/OurMission";

function Router() {
  const [location] = useLocation();
  const isAuthPage = location.includes("/auth") || location.includes("/register");

  return (
    <div className="flex flex-col min-h-screen w-full">
      {!isAuthPage && <Navbar />}

      <div className="flex-grow w-full">
        <Switch>
          {/* Public routes */}
          <Route path="/" component={HomePage} />
          <Route path="/register" component={UserTypeSelection} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/internships" component={InternshipList} />
          <Route path="/internships/:id">
            {(params) => <InternshipDetail id={params.id} />}
          </Route>

          {/* Intern routes */}
          <ProtectedRoute path="/intern/dashboard" component={StudentDashboard} requiredRole="intern" />
          <ProtectedRoute path="/saved-internships" component={SavedInternships} requiredRole="intern" />

          {/* Company routes */}
          <ProtectedRoute path="/company/dashboard" component={CompanyDashboard} requiredRole="company" />
          <ProtectedRoute path="/post-internship" component={PostInternship} requiredRole="company" />

          {/* View applications */}
          <Route path="/applications/:id">
            {(params) => (
              <ProtectedRoute
                path="/applications/:id"
                component={() => <ApplicationsView id={params.id} />}
                requiredRole="company"
              />
            )}
          </Route>

          {/* Static footer-linked pages */}
          <Route path="/application-tips" component={ApplicationTips} />
          <Route path="/internship-guide" component={InternshipGuide} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
          <Route path="/contact" component={Contact} />
          <Route path="/about/our-mission" component={OurMission} />

          {/* Role-based redirect */}
          <ProtectedRoute
            path="/dashboard"
            component={() => {
              try {
                const { user } = require("@/hooks/use-auth").useAuth();
                if (user?.role === "intern") window.location.href = "/intern/dashboard";
                else if (user?.role === "company") window.location.href = "/company/dashboard";
                else window.location.href = "/auth";
                return <div style={{ display: "none" }} />;
              } catch (error) {
                console.error("Dashboard redirect error:", error);
                window.location.href = "/auth";
                return <div style={{ display: "none" }} />;
              }
            }}
          />

          {/* Fallback */}
          <Route component={NotFound} />
        </Switch>
      </div>

      <Footer />
    </div>
  );
}

function App() {
  return <Router />;
}

export default App;