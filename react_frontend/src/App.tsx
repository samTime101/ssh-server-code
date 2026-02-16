import React from "react";
import { Navigate, Routes, Route, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import UserLayout from "@/layouts/UserLayout";
import AdminLayout from "@/layouts/AdminLayout";
import QuestionBankSection from "@/components/user/QuestionBankSection";
import QuestionProvider from "@/contexts/QuestionContext.tsx";
import QuestionPage from "@/pages/user/QuestionPage";
import AddQuestionPage from "@/pages/admin/AddQuestionPage";
import CreateCategoryPage from "@/pages/admin/CreateCategoryPage";
import ManageUsersPage from "@/pages/admin/ManageUsersPage";
import EditUserPage from "@/pages/admin/EditUserPage";
import QuestionBankPage from "@/pages/admin/QuestionBankPage";
import AddRolePage from "@/pages/admin/AddRolePage";
import AddCollegePage from "@/pages/admin/AddCollegePage";
import ProfilePage from "@/pages/user/ProfilePage";
import HistoryPage from "@/pages/user/HistoryPage";
import SettingsPage from "@/pages/user/SettingsPage";
import RoleRoute from "@/components/RoleRoute";
import Loader from "@/components/ui/Loader";
import ROLE_CONFIG from "@/config/roleConfig";
import EmailVerified from "@/pages/EmailVerified";

// Redirect user to correct panel based on role
const RootRedirect = () => {
  const { user, token } = useAuth();

  // Show loader while authentication is being determined
  if (token && !user) {
    return <Loader />;
  }

  if (!user) return <Navigate to="/auth/login" replace />;
  // Admins, Contributors, and Doctors can access admin panel
  if (user.roles?.some((role: string) => role in ROLE_CONFIG)) {
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
      </Route>
      <Route element={<PrivateRoute />}>
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
          <Route path="profile" element={<ProfilePage />} />
          <Route path="history" element={<HistoryPage />} />
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

          <Route element={<RoleRoute allowedPermissions={["create-category"]} />}>
            <Route path="create-category" element={<CreateCategoryPage />} />
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
        </Route>
      </Route>
      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};

export default App;
