import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import toast from "react-hot-toast";
import { signupSchema } from "./schema";

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

const Signup = () => {
  const navigate = useNavigate();

  // states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const signup = async () => {
    const validation = signupSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!validation.success) {
      const fieldErrors: FieldErrors = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof FieldErrors;
        fieldErrors[fieldName] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      setLoading(true);
      await API.post("/auth/register", { name, email, password });
      toast.success("Signup successfully! Please login.");
      navigate("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const axiosError = error as { response?: { data?: { msg?: string } } };
        toast.error(axiosError.response?.data?.msg || "Signup failed !");
      } else {
        toast.error("Signup failed !");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signup();
  };

  // input style
  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "5px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  };

  const errorStyle = { color: "red", marginBottom: "15px", fontSize: "14px" };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "30px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: "5px", color: "#1a83f3ff" }}>Ghar Bazzar</h1>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        Create your account to start using our platform.
      </p>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Signup</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        {errors.name && <div style={errorStyle}>{errors.name}</div>}

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

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyle}
        />
        {errors.confirmPassword && (
          <div style={errorStyle}>{errors.confirmPassword}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#1a83f3ff",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "bold",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: "10px",
          }}
        >
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "15px" }}>
        Already have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default Signup;
