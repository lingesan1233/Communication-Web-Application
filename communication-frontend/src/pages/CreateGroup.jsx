import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/CreateGroup.css";

export default function CreateGroup() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await API.get("/users/search?search=");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users");
    }
  };

  const toggleUser = (id) => {
    setSelectedUsers(prev => 
      prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
    );
  };

  const createGroup = async () => {
    if (!groupName.trim()) return alert("Please enter a group name");
    if (selectedUsers.length === 0) return alert("Select at least one member");

    setLoading(true);
    try {
      await API.post("/chat/group", { name: groupName, users: selectedUsers });
      navigate("/dashboard");
    } catch (err) {
      alert("Error creating group");
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search input
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="create-group-container">
        <div className="create-group-card">
          <h2>New Group</h2>
          <p className="subtitle">Set a name and invite your teammates.</p>

          <div className="group-input-section">
            <label>Group Name</label>
            <input
              className="main-input"
              placeholder="e.g. Project X Team"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          <div className="user-selection-header">
            <h3>Add Members</h3>
            <span className="badge">{selectedUsers.length} selected</span>
          </div>

          <input
            className="search-input"
            placeholder="Search users..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="user-scroll-list">
            {filteredUsers.map((user) => (
              <div 
                key={user._id} 
                className={`user-row ${selectedUsers.includes(user._id) ? "selected" : ""}`}
                onClick={() => toggleUser(user._id)}
              >
                <div className="user-info">
                  <img
                    src={user.profilePic ? `https://communication-web-application.onrender.com/${user.profilePic}` : `https://ui-avatars.com/api/?name=${user.name}`}
                    alt="avatar"
                    className="user-avatar"
                  />
                  <span>{user.name}</span>
                </div>
                <div className="checkbox-wrapper">
                   <div className={`custom-checkbox ${selectedUsers.includes(user._id) ? "checked" : ""}`}></div>
                </div>
              </div>
            ))}
          </div>

          <button className="create-btn" onClick={createGroup} disabled={loading}>
            {loading ? "Creating..." : "Start Chatting"}
          </button>
        </div>
      </div>
    </div>
  );
}