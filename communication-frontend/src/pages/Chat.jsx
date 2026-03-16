import {useEffect,useState} from "react"
import {useParams} from "react-router-dom"
import API from "../services/api"
import io from "socket.io-client"

import Message from "../components/Message"
import "../styles/Chat.css"

const socket = io("http://localhost:5000")

export default function Chat(){

const {id} = useParams()

const [messages,setMessages] = useState([])
const [text,setText] = useState("")

useEffect(()=>{

loadMessages()

socket.emit("joinRoom",id)

socket.on("receiveMessage",(msg)=>{
setMessages(prev => [...prev,msg])
})

return ()=>{
socket.off("receiveMessage")
}

},[id])


const loadMessages = async()=>{

try{

const res = await API.get(`/message/${id}`)

setMessages(res.data)

}catch(err){

console.log("Error loading messages")

}

}

const sendMessage = async()=>{

if(!text.trim()) return

try{

const res = await API.post("/message",{
content:text,
chatId:id
})

socket.emit("sendMessage",{
room:id,
content:text
})

setMessages(prev => [...prev,res.data])

setText("")

}catch(err){

console.log("Message failed")

}

}

return(

<div className="chat">

<div className="messages">

{messages.map((m,i)=>(
<Message key={i} message={m}/>
))}

</div>

<div className="send">

<input
value={text}
onChange={(e)=>setText(e.target.value)}
placeholder="Type message"
/>

<button onClick={sendMessage}>
Send
</button>

</div>

</div>

)

}