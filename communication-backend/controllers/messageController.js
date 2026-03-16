const Message = require("../models/Message")
const Chat = require("../models/Chat")

// SEND MESSAGE
exports.sendMessage = async (req,res)=>{

try{

const {content,chatId} = req.body

if(!content || !chatId){
return res.status(400).json({message:"Content and ChatId required"})
}

let message = await Message.create({
sender:req.user.id,
content,
chat:chatId
})

// populate sender
message = await message.populate("sender","name email")

// update latest message in chat
await Chat.findByIdAndUpdate(chatId,{
latestMessage:message._id
})

res.json(message)

}catch(err){

console.error(err)
res.status(500).json({message:"Server error"})

}

}



// GET CHAT MESSAGES
exports.getMessages = async(req,res)=>{

try{

const messages = await Message.find({
chat:req.params.chatId
})
.populate("sender","name email")
.sort({createdAt:1})

res.json(messages)

}catch(err){

console.error(err)
res.status(500).json({message:"Server error"})

}

}