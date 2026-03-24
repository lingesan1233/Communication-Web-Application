import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // Used to highlight the active tab

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Helper to check if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="nav-logo" onClick={() => navigate("/dashboard")}>
        <div className="logo-icon">💬</div>
        <h1>BAA GROUPS </h1>
      </div>

      <nav className="nav-buttons">
        <button 
          className={isActive("/dashboard") ? "nav-btn active" : "nav-btn"} 
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>
        
        <button 
          className={isActive("/create-group") ? "nav-btn active" : "nav-btn"} 
          onClick={() => navigate("/create-group")}
        >
          Create Group
        </button>

        <button 
          className={isActive("/profile") ? "nav-btn active" : "nav-btn"} 
          onClick={() => navigate("/profile")}
        >
          Profile
        </button>

        <button className="nav-btn logout-btn" onClick={logout}>
          Logout
        </button>
      </nav>
    </header>
  );
}