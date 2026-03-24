import { useEffect, useState, useRef } from "react"
import API from "../services/api"
import io from "socket.io-client"

import Navbar from "../components/Navbar"
import "../styles/Dashboard.css"

const socket = io("https://communication-web-application.onrender.com")

export default function Dashboard() {

const [chats, setChats] = useState([])
const [users, setUsers] = useState([])
const [search, setSearch] = useState("")
const [activeChat, setActiveChat] = useState(null)
const [messages, setMessages] = useState([])
const [text, setText] = useState("")

const messageEndRef = useRef()

/* REQUEST NOTIFICATION PERMISSION */

useEffect(() => {

if (Notification.permission !== "granted") {
Notification.requestPermission()
}

}, [])

/* LOAD CHATS */

useEffect(() => {
loadChats()
searchUsers("")
}, [])

/* SCROLL TO LAST MESSAGE */

useEffect(() => {
messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
}, [messages])

/* SOCKET LISTENER */

useEffect(() => {

socket.on("receiveMessage", (msg) => {

setMessages(prev => [...prev, msg])

// show notification if chat not open
if (!activeChat || msg.chatId !== activeChat._id) {

if (Notification.permission === "granted") {

new Notification("New Message", {
body: msg.content,
icon: "https://cdn-icons-png.flaticon.com/512/733/733585.png"
})

}

}

})

}, [activeChat])

const loadChats = async () => {
const res = await API.get("/chat")
setChats(res.data)
}

const searchUsers = async (value = "") => {

setSearch(value)

try {

const res = await API.get(`/users/search?search=${value}`)
setUsers(res.data)

} catch (err) {
console.log(err)
}

}

const openChat = async (chat) => {

setActiveChat(chat)

socket.emit("joinRoom", chat._id)

const res = await API.get(`/message/${chat._id}`)
setMessages(res.data)

}

const startChat = async (userId) => {

const res = await API.post("/chat/create", { userId })
openChat(res.data)

}

const sendMessage = async () => {

if (!text) return

const res = await API.post("/message", {
content: text,
chatId: activeChat._id
})

socket.emit("sendMessage", {
room: activeChat._id,
content: text,
chatId: activeChat._id
})

setMessages([...messages, res.data])
setText("")

}

const getUserIdFromToken = () => {

const token = localStorage.getItem("token")
if (!token) return null

const payload = JSON.parse(atob(token.split(".")[1]))
return payload.id

}

const currentUserId = getUserIdFromToken()

return (

<div className="dashboard-container">

<Navbar />

<div className="chat-layout">

{/* SIDEBAR */}

<div className="sidebar">

<h3>Chats</h3>

<input
placeholder="Search user..."
value={search}
onFocus={() => searchUsers("")}
onChange={(e) => searchUsers(e.target.value)}
/>

{search
? users.map(user => (

<div
key={user._id}
className="chat-item"
onClick={() => startChat(user._id)}
>

<img
src={
user.profilePic
? `https://communication-web-application.onrender.com/uploads/${user.profilePic}`
: `https://ui-avatars.com/api/?name=${user.name}`
}
className="chat-avatar"
/>

<span>{user.name}</span>

</div>

))
: chats.map(chat => {

const otherUser = chat.users?.find(
u => u._id !== currentUserId
)

return (

<div
key={chat._id}
className="chat-item"
onClick={() => openChat(chat)}
>

<img
src={
otherUser?.profilePic
? `https://communication-web-application.onrender.com/${otherUser.profilePic}`
: `https://ui-avatars.com/api/?name=${otherUser?.name}`
}
className="chat-avatar"
/>

<span>
{chat.isGroupChat ? chat.chatName : otherUser?.name}
</span>

</div>

)

})}

</div>

{/* CHAT AREA */}

<div className="chat-area">

{activeChat ? (

<>

<div className="chat-header">

<div className="chat-title">

{activeChat.isGroupChat
? activeChat.chatName
: activeChat.users?.find(u => u._id !== currentUserId)?.name}

</div>

{activeChat.isGroupChat && (

<div className="group-members">

{activeChat.users.map(user => (

<span key={user._id} className="member-name">
{user.name}
</span>

))}

</div>

)}

</div>

<div className="messages">

{messages.map((m, i) => {

const isMe =
m.sender === currentUserId ||
m.sender?._id === currentUserId

return (

<div
key={i}
className={isMe ? "message me" : "message"}
>

{m.content}

</div>

)

})}

<div ref={messageEndRef}></div>

</div>

<div className="send-box">

<input
value={text}
onChange={(e) => setText(e.target.value)}
placeholder="Type a message"
/>

<button onClick={sendMessage}>
Send
</button>

</div>

</>

) : (

<div className="welcome">

<h2>Welcome to Chat App</h2>
<p>Select a chat to start messaging</p>

</div>

)}

</div>

</div>

</div>

)

}