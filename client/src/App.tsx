import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./screens/login/Login";
import Dashboard from "./screens/dashboard/Dashboard";
import Signup from "./screens/signup/Signup";
import { Toaster } from "react-hot-toast";
import { UserRole } from "./types/userRole";

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

type AuthState = {
  token: string | null;
  user: User | null;
};

function App() {
  const [auth, setAuth] = useState<AuthState>(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    return {
      token,
      user: user ? (JSON.parse(user) as User) : null,
    };
  });

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Routes>
        <Route
          path="/"
          element={
            auth.token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login
                onLogin={({ token, user }) => {
                  setAuth({ token, user });
                }}
              />
            )
          }
        />

        <Route
          path="/signup"
          element={auth.token ? <Navigate to="/dashboard" replace /> : <Signup />}
        />

        <Route
          path="/dashboard"
          element={
            auth.token ? (
              <Dashboard token={auth.token} user={auth.user} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
