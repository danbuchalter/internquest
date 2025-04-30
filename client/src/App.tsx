import { Switch, Route, useRoute } from "wouter";
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

function Router() {
  const [isAuthPage] = useRoute("/auth");
  const [isRegisterPage] = useRoute("/register");
  const shouldHideNavbar = isAuthPage || isRegisterPage;

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Navbar is hidden only on /auth and /register routes */}
      {!shouldHideNavbar && <Navbar />}
      <div className="flex-grow w-full">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/register" component={UserTypeSelection} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/internships" component={InternshipList} />
          <Route path="/internships/:id">
            {(params) => <InternshipDetail id={params.id} />}
          </Route>

          <ProtectedRoute
            path="/intern/dashboard"
            component={StudentDashboard}
            requiredRole="intern"
          />
          <ProtectedRoute
            path="/saved-internships"
            component={SavedInternships}
            requiredRole="intern"
          />
          <ProtectedRoute
            path="/company/dashboard"
            component={CompanyDashboard}
            requiredRole="company"
          />
          <ProtectedRoute
            path="/post-internship"
            component={PostInternship}
            requiredRole="company"
          />
          <Route path="/applications/:id">
            {(params) => (
              <ProtectedRoute
                path="/applications/:id"
                component={() => <ApplicationsView id={params.id} />}
                requiredRole="company"
              />
            )}
          </Route>

          <ProtectedRoute
            path="/dashboard"
            component={() => {
              try {
                const { user } = require("@/hooks/use-auth").useAuth();
                if (user?.role === "intern") {
                  window.location.href = "/intern/dashboard";
                } else if (user?.role === "company") {
                  window.location.href = "/company/dashboard";
                }
                return <div style={{ display: "none" }} />;
              } catch (error) {
                console.error("Error in dashboard redirect:", error);
                window.location.href = "/auth";
                return <div style={{ display: "none" }} />;
              }
            }}
          />

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