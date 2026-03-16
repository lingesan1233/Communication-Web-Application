const Chat = require("../models/Chat")

/* CREATE OR GET PRIVATE CHAT */

exports.createChat = async (req, res) => {

try {

const { userId } = req.body

if (!userId) {
return res.status(400).json({ message: "User ID required" })
}

/* CHECK IF CHAT ALREADY EXISTS */

let chat = await Chat.findOne({
isGroupChat: false,
users: { $all: [req.user.id, userId] }
})
.populate("users", "name email profilePic")
.populate("groupAdmin", "name")

/* RETURN EXISTING CHAT */

if (chat) {
return res.json(chat)
}

/* CREATE NEW CHAT */

chat = await Chat.create({
users: [req.user.id, userId]
})

/* POPULATE USER DETAILS */

chat = await Chat.findById(chat._id)
.populate("users", "name email profilePic")

res.json(chat)

} catch (err) {

console.error(err)
res.status(500).json({ message: "Server error" })

}

}



/* CREATE GROUP CHAT */

exports.createGroup = async (req, res) => {

try {

const { name, users } = req.body

if (!name || !users) {
return res.status(400).json({
message: "Group name and users required"
})
}

/* CREATE GROUP */

const group = await Chat.create({
chatName: name,
isGroupChat: true,
users: [...users, req.user.id],
groupAdmin: req.user.id
})

/* POPULATE GROUP DETAILS */

const fullGroup = await Chat.findById(group._id)
.populate("users", "name email profilePic")
.populate("groupAdmin", "name")

res.json(fullGroup)

} catch (err) {

console.error(err)
res.status(500).json({ message: "Server error" })

}

}



/* GET USER CHATS */

exports.getChats = async (req, res) => {

try {

const chats = await Chat.find({
users: req.user.id
})
.populate("users", "name email profilePic")
.populate("groupAdmin", "name")
.sort({ updatedAt: -1 })

res.json(chats)

} catch (err) {

console.error(err)
res.status(500).json({ message: "Server error" })

}

}