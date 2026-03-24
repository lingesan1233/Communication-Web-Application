import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Please enter your details to sign in.</p>

        <div className="input-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="name@company.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-button" onClick={login} disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="login-footer">
          <span>Don't have an account?</span>
          <button className="link-btn" onClick={() => navigate("/signup")}>
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}