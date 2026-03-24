import "../styles/Message.css";

export default function Message({ message }) {
  // Get current user ID from token to identify "isMe"
  const getUserId = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")));
      return payload.id;
    } catch (e) {
      return null;
    }
  };

  const currentUserId = getUserId();
  const isMe = message.sender === currentUserId || message.sender?._id === currentUserId;

  // Format timestamp (e.g., 10:45 AM)
  const time = new Date(message.createdAt || Date.now()).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`wa-message-row ${isMe ? "me" : "them"}`}>
      <div className="wa-message-bubble">
        {/* Show sender name only if it's a group chat and not sent by me */}
        {!isMe && message.sender?.name && (
          <span className="wa-message-sender">{message.sender.name}</span>
        )}
        
        <p className="wa-message-text">{message.content}</p>
        
        <div className="wa-message-footer">
          <span className="wa-message-time">{time}</span>
          {isMe && <span className="wa-message-check">✓✓</span>}
        </div>
      </div>
    </div>
  );
}