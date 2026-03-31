import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../../api/api";
import toast from "react-hot-toast";
import { loginSchema } from "./schema";

type FieldErrors = {
  email?: string;
  password?: string;
};

const Login = () => {
  const navigate = useNavigate();

  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const login = async () => {
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const fieldErrors: FieldErrors = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof FieldErrors;
        fieldErrors[fieldName] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({}); // clear previous errors

    try {
      setLoading(true);
      const res = await API.post("/auth/login", {
        email,
        password,
      });
      const token = res.data?.data;

      if (!token) {
        toast.error("Login failed: No token received from server!");
        return;
      }

      localStorage.setItem("token", token);

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || error.message || "Login failed!",
        );
      } else if (error instanceof Error) {
        toast.error(error.message || "Login failed!");
      } else {
        toast.error("Login failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login();
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
  };

  const errorStyle = { color: "red", marginBottom: "15px", fontSize: "14px" };

  return (
    <div
      style={{
        maxWidth: "350px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: "5px", color: "#1a83f3ff" }}>Ghar Bazzar</h1>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        <b>Welcome back!</b> Please login to access your dashboard.
      </p>

      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        {errors.email && <div style={errorStyle}>{errors.email}</div>}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        {errors.password && <div style={errorStyle}>{errors.password}</div>}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#1a83f3ff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "15px" }}>
        Don't have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/signup")}
        >
          Signup
        </span>
      </p>
    </div>
  );
};

export default Login;
