require("dotenv").config()

const express = require("express")
const cors = require("cors")
const http = require("http")
const {Server} = require("socket.io")

const connectDB = require("./config/db")

const authRoutes = require("./routes/authRoutes")
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes")
const userRoutes = require("./routes/userRoutes")

const dns = require("node:dns/promises")
dns.setServers(["8.8.8.8","8.8.4.4"])

connectDB()

const app = express()

app.use(cors())
app.use(express.json())

/* SERVE PROFILE IMAGES */
app.use("/uploads", express.static("uploads"))

/* ROUTES */
app.use("/api/auth",authRoutes)
app.use("/api/chat",chatRoutes)
app.use("/api/message",messageRoutes)
app.use("/api/users",userRoutes)

const server = http.createServer(app)

const io = new Server(server,{
cors:{
origin:"*"
}
})

io.on("connection",(socket)=>{

console.log("User connected:",socket.id)

socket.on("joinRoom",(room)=>{
socket.join(room)
})

socket.on("sendMessage",(data)=>{
io.to(data.room).emit("receiveMessage",data)
})

socket.on("disconnect",()=>{
console.log("User disconnected")
})

})

server.listen(process.env.PORT || 5000,()=>{
console.log("Server running on port",process.env.PORT || 5000)
})