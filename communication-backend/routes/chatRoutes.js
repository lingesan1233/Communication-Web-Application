const router = require("express").Router()

const auth = require("../middleware/authMiddleware")

const {
createChat,
createGroup,
getChats
} = require("../controllers/chatController")

// create private chat
router.post("/create", auth, createChat)

// create group chat
router.post("/group", auth, createGroup)

// get all chats
router.get("/", auth, getChats)

module.exports = router