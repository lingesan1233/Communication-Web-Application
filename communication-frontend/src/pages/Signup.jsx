import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/Signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signup = async () => {
    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/signup", { name, email, password });
      navigate("/"); // Redirect to login
    } catch (err) {
      alert("Signup failed. That email might already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="signup-card">
        <h2>Create Account</h2>
        <p className="subtitle">Join us to start managing your dashboard.</p>

        <div className="input-group">
          <label>Full Name</label>
          <input
            placeholder="John Doe"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

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
            placeholder="Create a strong password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="signup-button" onClick={signup} disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <div className="auth-footer">
          <span>Already have an account?</span>
          <button className="link-btn" onClick={() => navigate("/")}>
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}