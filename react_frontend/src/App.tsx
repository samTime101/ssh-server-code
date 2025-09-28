import React from "react";
import { Navigate, Routes, Route, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import UserLayout from "@/layouts/UserLayout";
//import TeacherLayout from "@/layouts/TeacherLayout";
import AdminLayout from "@/layouts/AdminLayout";
//import AddQuestionPage from "@/pages/admin/AddQuestionPage";
//import CreateCategoryPage from "@/pages/admin/CreateCategoryPage";
//import QuestionPage from "./pages/user/QuestionPage";
import QuestionBankSection from "./components/user/QuestionBankSection";

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
  const { token, user, logout } = useAuth();

  if (token && user) {
    if (user.is_superuser) return <Navigate to="/admin" />;
    if (user.is_staff) return <Navigate to="/teacherpanel" />;
    return <Navigate to="/userpanel" />;
  }

  if (token && !user) {
    logout();
  }

  return <Navigate to="/login" />;
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
        <Route path="/userpanel" element={<UserLayout />}>
          <Route path="question-bank" element={<QuestionBankSection />} index></Route>
          {/* <Route path="question" element={<QuestionPage />}></Route> */}
        </Route>
        {/* <Route path="/teacherpanel" element={<TeacherLayout />} /> */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* <Route path="add-question" element={<AddQuestionPage />} />
          <Route path="create-category" element={<CreateCategoryPage />} /> */}
        </Route>
      </Route>

      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
// function App() {
//   return (
//     <BrowserRouter>
//       <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
//         <div className="w-full max-w-sm">
//           <Routes>
//             <Route path="/" element={<RootRedirect />} />
//             <Route path="/login" element={<Page />} />
//             <Route path="/questions" element={<QuestionsPage />} />
//             <Route element={<ProtectedRoute />}>
//               <Route path="/userpanel" element={<UserPanel />} />
//               <Route path="/teacherpanel" element={<TeacherPanel />} />
//               <Route path="/adminpanel" element={<AdminPanel />} />
//               <Route path="/categories" element={<Categories />} />
//               <Route path="/add-questions" element={<AddQuestions />} />
//             </Route>
//           </Routes>
//         </div>
//       </div>
//     </BrowserRouter>
//   );
// }

export default App;
