import { useEffect, useState } from "react"
import API from "../services/api"
import "../styles/Profile.css"
import Navbar from "../components/Navbar"

export default function Profile(){

const [user,setUser] = useState({})
const [name,setName] = useState("")
const [email,setEmail] = useState("")
const [file,setFile] = useState(null)

useEffect(()=>{
loadProfile()
},[])

const loadProfile = async()=>{

const res = await API.get("/users/profile")

setUser(res.data)
setName(res.data.name)
setEmail(res.data.email)

}

const handleFileChange = (e)=>{
setFile(e.target.files[0])
}

const updateProfile = async()=>{

const formData = new FormData()

formData.append("name",name)
formData.append("email",email)

if(file){
formData.append("profilePic",file)
}

await API.put("/users/profile",formData)

alert("Profile updated")

loadProfile()

}

return(

<div>

{/* NAVBAR */}
<Navbar />

{/* PROFILE CONTENT */}
<div className="profile">

<h2>My Profile</h2>

<img
src={
user.profilePic
? `http://localhost:5000/uploads/${user.profilePic}`
: "https://i.imgur.com/HeIi0wU.png"
}
className="profile-img"
/>

<input
type="file"
onChange={handleFileChange}
/>

<input
value={name}
onChange={(e)=>setName(e.target.value)}
placeholder="Name"
/>

<input
value={email}
onChange={(e)=>setEmail(e.target.value)}
placeholder="Email"
/>

<button onClick={updateProfile}>
Update Profile
</button>

</div>

</div>

)

}