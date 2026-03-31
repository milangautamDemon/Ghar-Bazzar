import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./screens/login/Login";
import Dashboard from "./screens/dashboard/Dashboard";
import Signup from "./screens/signup/Signup";
import { Toaster } from "react-hot-toast";

function App() {
  const token = localStorage.getItem("token");

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/dashboard" /> : <Login />}
        />

        <Route
          path="/signup"
          element={token ? <Navigate to="/dashboard" /> : <Signup />}
        />

        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
}

export default App;
