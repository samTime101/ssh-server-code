import React from "react";
import { Navigate, Routes, Route, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import LandingPage from "@/pages/LandingPage";
import UserLayout from "@/layouts/UserLayout";
import AdminLayout from "@/layouts/AdminLayout";
import QuestionBankSection from "@/components/user/QuestionBankSection";
import CEEPracticeSection from "@/components/user/CEEPracticeSection";
import QuestionProvider from "@/contexts/QuestionContext.tsx";
import QuestionPage from "@/pages/user/QuestionPage";
import CEEQuestionPage from "@/pages/user/CEEQuestionPage";
import AddQuestionPage from "@/pages/admin/AddQuestionPage";
import CreateCategoryPage from "@/pages/admin/CreateCategoryPage";
import ManageCategoriesPage from "@/pages/admin/ManageCategoriesPage";
import ManageSubcategoriesPage from "@/pages/admin/ManageSubcategoriesPage";
import ManageConstraintsPage from "@/pages/admin/ManageConstraintsPage";
import ManageSubscriptionsPage from "@/pages/admin/ManageSubscriptionsPage";
import ManageUsersPage from "@/pages/admin/ManageUsersPage";
import EditUserPage from "@/pages/admin/EditUserPage";
import QuestionBankPage from "@/pages/admin/QuestionBankPage";
import AddRolePage from "@/pages/admin/AddRolePage";
import AddCollegePage from "@/pages/admin/AddCollegePage";
import ManageQuestionSetsPage from "@/pages/admin/ManageQuestionSetsPage";
import ApplicationFeedbackPage from "@/pages/admin/ApplicationFeedbackPage";
import ManageTestimonialsPage from "@/pages/admin/ManageTestimonialsPage";
import AdminSettingsPage from "@/pages/admin/AdminSettingsPage";
import QuestionFeedbackPage from "@/pages/admin/QuestionFeedbackPage";
import ProfilePage from "@/pages/user/ProfilePage";
import MockExamPage from "@/pages/user/MockExamPage";
import HistoryPage from "@/pages/user/HistoryPage";
import BookmarksPage from "@/pages/user/BookmarksPage";
import SettingsPage from "@/pages/user/SettingsPage";
import SharedQuestionPage from "@/pages/public/SharedQuestionPage";
import RoleRoute from "@/components/RoleRoute";
import Loader from "@/components/ui/Loader";
import ROLE_CONFIG from "@/config/roleConfig";
import EmailVerified from "@/pages/EmailVerified";
import ResetPasswordPage from "@/pages/ResetPasswordPage";

// Redirect user to correct panel based on role
const RootRedirect = () => {
  const { user, token } = useAuth();

  // Show loader while authentication is being determined
  if (token && !user) {
    return <Loader />;
  }

  // Show landing page if not authenticated
  if (!token) return <LandingPage />;

  // Admins, Contributors, and Doctors can access admin panel
  if (user?.roles?.some((role: string) => role in ROLE_CONFIG)) {
    return <Navigate to="/admin" replace />;
  }
  return <Navigate to="/userpanel" replace />;
};

const PrivateRoute = () => {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return !token ? children : <Navigate to="/" replace />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/auth">
        <Route
          path="login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />
        <Route
          path="verify-email/:token"
          element={
            <PublicRoute>
              <EmailVerified />
            </PublicRoute>
          }
        />
        <Route
          path="reset-password/:token"
          element={
            <PublicRoute>
              <ResetPasswordPage />
            </PublicRoute>
          }
        />
      </Route>
      <Route path="/shared/question/:id" element={<SharedQuestionPage />} />
      <Route element={<PrivateRoute />}>
        <Route
          path="/userpanel/mock-exams"
          element={
            <QuestionProvider>
              <MockExamPage />
            </QuestionProvider>
          }
        />
        {/* User Panel */}
        <Route
          path="/userpanel"
          element={
            <QuestionProvider>
              <UserLayout />
            </QuestionProvider>
          }
        >
          <Route index element={<Navigate to="question-bank" replace />} />
          <Route path="question-bank" element={<QuestionBankSection />} />
          <Route path="question" element={<QuestionPage />} />
          <Route path="cee-practice" element={<CEEPracticeSection />} />
          <Route path="cee-question" element={<CEEQuestionPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="bookmarks" element={<BookmarksPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Admin Panel */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route element={<RoleRoute allowedPermissions={["add-question"]} />}>
            <Route path="add-question" element={<AddQuestionPage />} />
          </Route>

          <Route element={<RoleRoute allowedPermissions={["question-bank"]} />}>
            <Route path="question-bank" element={<QuestionBankPage />} />
          </Route>

          <Route element={<RoleRoute allowedPermissions={["manage-question-sets"]} />}>
            <Route path="manage-question-sets" element={<ManageQuestionSetsPage />} />
          </Route>

          <Route element={<RoleRoute allowedPermissions={["create-category"]} />}>
            <Route path="create-category" element={<CreateCategoryPage />} />
          </Route>

          <Route element={<RoleRoute allowedPermissions={["manage-categories"]} />}>
            <Route path="manage-categories" element={<ManageCategoriesPage />} />
          </Route>

          <Route element={<RoleRoute allowedPermissions={["manage-subcategories"]} />}>
            <Route path="manage-subcategories" element={<ManageSubcategoriesPage />} />
          </Route>

          <Route element={<RoleRoute allowedPermissions={["manage-constraints"]} />}>
            <Route path="manage-constraints" element={<ManageConstraintsPage />} />
          </Route>

          <Route element={<RoleRoute allowedPermissions={["manage-subscriptions"]} />}>
            <Route path="manage-subscriptions" element={<ManageSubscriptionsPage />} />
          </Route>

          <Route element={<RoleRoute allowedPermissions={["manage-users"]} />}>
            <Route path="manage-users" element={<ManageUsersPage />} />
          </Route>

          <Route element={<RoleRoute allowedPermissions={["manage-users/:id"]} />}>
            <Route path="manage-users/:id" element={<EditUserPage />} />
          </Route>

          <Route element={<RoleRoute allowedPermissions={["add-role"]} />}>
            <Route path="add-role" element={<AddRolePage />} />
          </Route>

          <Route element={<RoleRoute allowedPermissions={["add-college"]} />}>
            <Route path="add-college" element={<AddCollegePage />} />
          </Route>

          <Route element={<RoleRoute allowedPermissions={["application-feedback"]} />}>
            <Route path="feedback/application" element={<ApplicationFeedbackPage />} />
            <Route path="feedback/question" element={<QuestionFeedbackPage />} />
          </Route>

          <Route element={<RoleRoute allowedPermissions={["manage-testimonials"]} />}>
            <Route path="testimonials" element={<ManageTestimonialsPage />} />
          </Route>

          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>
      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
