import { useEffect, useState } from "react"
import API from "../services/api"
import { useNavigate } from "react-router-dom"

import Navbar from "../components/Navbar"
import "../styles/CreateGroup.css"

export default function CreateGroup(){

const [users,setUsers] = useState([])
const [selectedUsers,setSelectedUsers] = useState([])
const [groupName,setGroupName] = useState("")

const navigate = useNavigate()

useEffect(()=>{
loadUsers()
},[])

const loadUsers = async()=>{

const res = await API.get("/users/search?search=")
setUsers(res.data)

}

const toggleUser = (id)=>{

if(selectedUsers.includes(id)){
setSelectedUsers(selectedUsers.filter(u=>u!==id))
}else{
setSelectedUsers([...selectedUsers,id])
}

}

const createGroup = async()=>{

if(!groupName){
alert("Enter group name")
return
}

if(selectedUsers.length===0){
alert("Select users")
return
}

await API.post("/chat/group",{
name:groupName,
users:selectedUsers
})

alert("Group created")

navigate("/dashboard")

}

return(

<div>

<Navbar/>

<div className="create-group">

<h2>Create Group</h2>

<input
placeholder="Group name"
value={groupName}
onChange={(e)=>setGroupName(e.target.value)}
/>

<h3>Select Users</h3>

<div className="user-list">

{users.map(user=>(

<div key={user._id} className="user-item">

<label>

<input
type="checkbox"
onChange={()=>toggleUser(user._id)}
/>

<img
src={
user.profilePic
? `http://localhost:5000/uploads/${user.profilePic}`
: `https://ui-avatars.com/api/?name=${user.name}`
}
className="group-avatar"
/>

{user.name}

</label>

</div>

))}

</div>

<button onClick={createGroup}>
Create Group
</button>

</div>

</div>

)

}