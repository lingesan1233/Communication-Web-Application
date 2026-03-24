import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/Profile.css";
import Navbar from "../components/Navbar";

export default function Profile() {
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await API.get("/users/profile");
      setUser(res.data);
      setName(res.data.name);
      setEmail(res.data.email);
    } catch (err) {
      console.error("Error loading profile");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files;
    setFile(selectedFile);
    // Create a local URL for instant preview
    setPreview(URL.createObjectURL(selectedFile));
  };

  const updateProfile = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (file) formData.append("profilePic", file);

    try {
      await API.put("/users/profile", formData);
      alert("Profile updated successfully!");
      loadProfile();
      setPreview(null); // Reset preview to use the new server URL
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wa-profile-page">
      <Navbar />
      
      <div className="wa-profile-container">
        <div className="wa-profile-card">
          <div className="wa-profile-header">
            <h2>Profile</h2>
          </div>

          <div className="wa-avatar-section">
            <div className="wa-avatar-wrapper">
              <img
                src={
                  preview || (user.profilePic
                    ? `https://communication-web-application.onrender.com/${user.profilePic}`
                    : `https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`)
                }
                alt="Profile"
                className="wa-large-avatar"
              />
              <label className="wa-camera-icon">
                📷
                <input type="file" hidden onChange={handleFileChange} />
              </label>
            </div>
            <p className="wa-avatar-hint">Click the camera to change photo</p>
          </div>

          <div className="wa-form-group">
            <label>Your Name</label>
            <div className="wa-input-wrapper">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
              <span className="wa-edit-icon">✎</span>
            </div>
            <small>This is not your username or pin. This name will be visible to your WhatsApp contacts.</small>
          </div>

          <div className="wa-form-group">
            <label>Email Address</label>
            <div className="wa-input-wrapper">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
          </div>

          <button className="wa-save-btn" onClick={updateProfile} disabled={loading}>
            {loading ? "SAVING..." : "SAVE PROFILE"}
          </button>
        </div>
      </div>
    </div>
  );
}