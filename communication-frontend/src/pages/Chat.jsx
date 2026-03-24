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
    <div className="wa-page-bg">
      <Navbar />
      <div className="wa-create-container">
        <div className="wa-create-card">
          <div className="wa-create-header">
            <h2>New Group</h2>
            <p>Add group name and members</p>
          </div>

          <div className="wa-section">
            <input
              className="wa-name-input"
              placeholder="Group Subject (Name)"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          <div className="wa-section">
            <div className="wa-list-header">
              <span>Add Members</span>
              <span className="wa-count">{selectedUsers.length} selected</span>
            </div>
            
            <div className="wa-search-box">
              <input
                placeholder="Search name..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="wa-user-list">
              {filteredUsers.map((user) => (
                <div 
                  key={user._id} 
                  className={`wa-user-row ${selectedUsers.includes(user._id) ? "selected" : ""}`}
                  onClick={() => toggleUser(user._id)}
                >
                  <div className="wa-user-main">
                    <img
                      src={user.profilePic ? `https://communication-web-application.onrender.com/${user.profilePic}` : `https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`}
                      alt="avatar"
                      className="wa-row-avatar"
                    />
                    <span className="wa-user-name">{user.name}</span>
                  </div>
                  <div className="wa-check-circle">
                    {selectedUsers.includes(user._id) && "✓"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="wa-create-btn" onClick={createGroup} disabled={loading}>
            {loading ? "Creating..." : "CREATE GROUP"}
          </button>
        </div>
      </div>
    </div>
  );
}