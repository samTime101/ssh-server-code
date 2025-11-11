import React, { useEffect } from "react";
import { Navigate, Routes, Route, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import UserLayout from "@/layouts/UserLayout";
import AdminLayout from "@/layouts/AdminLayout";
import QuestionBankSection from "./components/user/QuestionBankSection";
import QuestionProvider from "@/contexts/QuestionContext.tsx";
import QuestionPage from "./pages/user/QuestionPage";
import AddQuestionPage from "./pages/admin/AddQuestionPage";
import CreateCategoryPage from "./pages/admin/CreateCategoryPage";
import Loader from "./components/ui/Loader";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import QuestionBankPage from "./pages/admin/QuestionBankPage";

const PrivateRoute = () => {
  const { token } = useAuth();
  console.log("PrivateRoute token:", token);
  return token ? <Outlet /> : <Navigate to="/auth/login" />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return !token ? children : <Navigate to="/" />;
};

const RootRedirect = () => {
  const { token, user } = useAuth();

  if (token && user) {
    if (user.is_superuser) return <Navigate to="/admin" />;
    if (user.is_staff) return <Navigate to="/teacherpanel" />;
    return <Navigate to="/userpanel" />;
  }

  if (token && !user) {
    return <Loader />;
  }

  return <Navigate to="/auth/login" />;
};

const AdminRoute = () => {
  const { token, user } = useAuth();
  return token && user?.is_superuser ? <Outlet /> : <Navigate to="/" />;
};

const UserRoute = () => {
  const { token, user } = useAuth();
  return token && user && !user.is_superuser ? <Outlet /> : <Navigate to="/" />;
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
        ></Route>
        <Route
          path="signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        ></Route>
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<UserRoute />}>
          <Route
            path="/userpanel"
            element={
              <QuestionProvider>
                <UserLayout />
              </QuestionProvider>
            }
          >
            <Route index element={<Navigate to="question-bank" replace />} />
            <Route
              path="question-bank"
              element={<QuestionBankSection />}
              index
            ></Route>
            {<Route path="question" element={<QuestionPage />}></Route>}
          </Route>
        </Route>

        {/* <Route path="/teacherpanel" element={<TeacherLayout />} /> */}

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="add-question" element={<AddQuestionPage />} />
            <Route path="create-category" element={<CreateCategoryPage />} />
            <Route path="manage-users" element={<ManageUsersPage />} />
            <Route path="question-bank" element={<QuestionBankPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
