import { useNavigate } from "react-router-dom"
import "../styles/Navbar.css"

export default function Navbar(){

const navigate = useNavigate()

const logout = ()=>{
localStorage.removeItem("token")
navigate("/")
}

return(

<div className="navbar">

<h2>Chat App</h2>

<div className="nav-buttons">

<button onClick={()=>navigate("/dashboard")}>
Dashboard
</button>

<button onClick={()=>navigate("/create-group")}>
Create Group
</button>

<button onClick={()=>navigate("/profile")}>
Profile
</button>

<button onClick={logout}>
Logout
</button>

</div>

</div>

)

}